// external dependencies
import React from 'react';
import {findDOMNode} from 'react-dom';

// utils
import {
  IGNORED_COMPONENT_KEYS,
  IGNORED_STATIC_KEYS,
  addPropTypeIsRequired,
  bindSetState,
  createRefCreator,
  getNamespacedRef,
  identity,
  isClassComponent,
  logInvalidInstanceError
} from './utils';

/**
 * @function createCombinedRef
 *
 * @description
 * create a ref that assigns both the raw component and the underlying HTML element to the instance on a namespace
 *
 * @param {ReactComponent} instance the instance to assign to
 * @param {string} ref the instance value name
 * @returns {{component: ReactComponent, element: HTMLElement}} the combined ref
 */
export const createCombinedRef = createRefCreator(getNamespacedRef);

/**
 * @function createComponentRef
 *
 * @description
 * create a ref that assigns the component itself to the instance
 *
 * @param {ReactComponent} instance the instance to assign to
 * @param {string} ref the instance value name
 * @returns {ReactComponent} the component ref
 */
export const createComponentRef = createRefCreator(identity);

/**
 * @function createElementRef
 *
 * @description
 * create a ref that assigns the component's underlying HTML element to the instance
 *
 * @param {ReactComponent} instance the instance to assign to
 * @param {string} ref the instance value name
 * @returns {HTMLElement} the element ref
 */
export const createElementRef = createRefCreator(findDOMNode);

/**
 * @function createMethod
 *
 * @description
 * create a method that is a pure version of the lifecycle / instance method passed to it
 *
 * @param {ReactComponent} instance the instance the method is assigned to
 * @param {function} method the instance method
 * @param {Array<any>} extraArgs additional args to pass to the method
 * @returns {function(...Array<any>): any} the method with the instance passed as value
 */
export const createMethod = (instance, method, ...extraArgs) =>
  isClassComponent(instance)
    ? bindSetState(instance) && ((...args) => method.call(instance, instance, args, extraArgs))
    : logInvalidInstanceError('method');

/**
 * @function createRender
 *
 * @description
 * create a method that is a pure version of the render method
 *
 * @param {ReactComponent} instance the instance the method is assigned to
 * @param {function} render the render method
 * @returns {function(): ReactElement} the method with the props and instance passed as values
 */
export const createRender = (instance, render) =>
  isClassComponent(instance)
    ? bindSetState(instance) && ((...args) => render.call(instance, instance.props, instance, args))
    : logInvalidInstanceError('render');

/**
 * @function createRenderProps
 *
 * @description
 * create a render props method, where the props passed and the instance it is rendered in are passed as props to it
 *
 * @param {ReactComponent} instance the instance the method is assigned to
 * @param {function} renderProps the render props method
 * @returns {function(Object): ReactElement} the method with the props and instance passed as values
 */
export const createRenderProps = (instance, renderProps) =>
  isClassComponent(instance)
    ? bindSetState(instance) && ((props, ...restOfArgs) => renderProps.call(instance, props, instance, restOfArgs))
    : logInvalidInstanceError('render props');

/**
 * @function createValue
 *
 * @description
 * create a value to assign to the instance based on props or the instance itself
 *
 * @param {ReactComponent} instance the instance the method is assigned to
 * @param {function} getValue the function to get the value with
 * @param {Array<any>} extraArgs additional args to pass to the method
 * @returns {function(...Array<any>): any} the method with the instance passed as value
 */
export const createValue = (instance, getValue, ...extraArgs) =>
  isClassComponent(instance)
    ? bindSetState(instance) && getValue.call(instance, instance, extraArgs)
    : logInvalidInstanceError('value');

/**
 * @function createComponent
 *
 * @description
 * create a component from the render method and any options passed
 *
 * @param {function|Object} render the function to render the component, or the options for future curried calls
 * @param {Object} [passedOptions] the options to render the component with
 * @param {function} [getInitialState] the method to get the initial state with
 * @param {boolean} [isPure] is PureComponent used
 * @param {function} [onConstruct] a method to call when constructing the component
 * @param {Object} [state] the initial state
 * @returns {function|ReactComponent} the component class, or a curried call to itself
 */
export const createComponent = (render, passedOptions) => {
  if (typeof render !== 'function') {
    const options = render || {};

    return (render, moreOptions) =>
      typeof render === 'function'
        ? createComponent(render, {
          ...options,
          ...(moreOptions || {}),
        })
        : createComponent({
          ...options,
          ...(render || {}),
        });
  }

  const options = passedOptions || {};
  const {getInitialState, getInitialValues, isPure, onConstruct, state} = options;

  const Constructor = isPure ? React.PureComponent : React.Component;

  function ParmComponent(initialProps) {
    Constructor.call(this, initialProps);

    this.state = typeof getInitialState === 'function' ? createValue(this, getInitialState) : state || null;

    for (let key in options) {
      if (!IGNORED_COMPONENT_KEYS[key]) {
        this[key] =
          typeof options[key] === 'function'
            ? options[key].isRender
              ? createRender(this, options[key])
              : options[key].isRenderProps
                ? createRenderProps(this, options[key])
                : createMethod(this, options[key])
            : options[key];
      }
    }

    const values = typeof getInitialValues === 'function' ? createValue(this, getInitialValues) : null;

    if (values && typeof values === 'object') {
      for (let key in values) {
        this[key] = values[key];
      }
    }

    this.render = createRender(this, render);

    if (typeof onConstruct === 'function') {
      onConstruct(this);
    }

    return this;
  }

  ParmComponent.prototype = Object.create(Constructor.prototype);

  ParmComponent.displayName = render.displayName || render.name || 'ParmComponent';

  Object.keys(render).forEach(
    (staticKey) => !IGNORED_STATIC_KEYS[staticKey] && (ParmComponent[staticKey] = render[staticKey])
  );

  return ParmComponent;
};

/**
 * @function createPropType
 *
 * @description
 * create a custom prop type handler
 *
 * @param {function(Object): (Error|null)} handler the prop type handler
 * @returns {function} the custom prop type
 */
export const createPropType = (handler) =>
  addPropTypeIsRequired((props, key, component, locationIgnored, fullKey) =>
    handler({
      component,
      key,
      name: fullKey ? fullKey.split(/(\.|\[)/)[0] : key,
      path: fullKey || key,
      props,
      value: props[key],
    })
  );
