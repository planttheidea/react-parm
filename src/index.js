// external dependencies
import React from 'react';
import {findDOMNode} from 'react-dom';

// utils
import {
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
 * the conditional function return is to ensure the method is called with as performant a way as possible
 *
 * @param {ReactComponent} instance the instance the method is assigned to
 * @param {function} method the instance method
 * @param {Array<any>} extraArgs additional args to pass to the method
 * @returns {function(...Array<any>): any} the method with the instance passed as value
 */
export const createMethod = (instance, method, ...extraArgs) =>
  isClassComponent(instance)
    ? bindSetState(instance) && ((...args) => method.call(instance, instance, args, extraArgs))
    : logInvalidInstanceError('method'); // eslint-disable-line no-console

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
export const createComponent = (render, {getInitialState, isPure, state, ...options} = {}) => {
  const Constructor = isPure ? React.PureComponent : React.Component;

  function ParmComponent(initialProps) {
    Constructor.call(this, initialProps);

    this.state = typeof getInitialState === 'function' ? createMethod(this, getInitialState)() : state || null;

    Object.keys(options).forEach((key) => {
      this[key] = typeof options[key] === 'function' ? createMethod(this, options[key]) : options[key];
    });

    this.render = createMethod(this, render);

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
