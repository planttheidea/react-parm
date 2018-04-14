// external dependencies
import React from 'react';
import {findDOMNode} from 'react-dom';

// utils
import {
  IGNORED_COMPONENT_KEYS,
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
    ? bindSetState(instance) && (() => render.call(instance, instance.props, instance))
    : logInvalidInstanceError('render');

/**
 * @function createComponent
 *
 * @description
 * create a component from the render method and any options passed
 *
 * @param {function} render the function to render the component
 * @param {Object} [options={}] the options to render the component with
 * @param {function} [getInitialState] the method to get the initial state with
 * @param {boolean} [isPure] is PureComponent used
 * @param {Object} [state] the initial state
 * @returns {ReactComponent} the component class
 */
export const createComponent = (render, options = {}) => {
  const {getInitialState, isPure, state} = options;
  const Constructor = isPure ? React.PureComponent : React.Component;

  function ParmComponent(initialProps) {
    Constructor.call(this, initialProps);

    Object.keys(options).forEach((key) => {
      if (!~IGNORED_COMPONENT_KEYS.indexOf(key)) {
        this[key] = typeof options[key] === 'function' ? createMethod(this, options[key]) : options[key];
      }
    });

    this.state = typeof getInitialState === 'function' ? createMethod(this, getInitialState)() : state || null;
    this.render = createRender(this, render);

    return this;
  }

  ParmComponent.prototype = Object.create(Constructor.prototype);

  ParmComponent.displayName = render.displayName || render.name || 'ParmComponent';
  ParmComponent.propTypes = render.propTypes;
  ParmComponent.contextTypes = render.contextTypes;
  ParmComponent.childContextTypes = render.childContextTypes;
  ParmComponent.defaultProps = render.defaultProps;

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
      value: props[key]
    })
  );
