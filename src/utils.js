// external dependencies
import React from 'react';
import {findDOMNode} from 'react-dom';

/**
 * @constant {Object} IGNORED_COMPONENT_KEYS keys to ignore when creating a component
 */
export const IGNORED_COMPONENT_KEYS = {
  getInitialState: true,
  getInitialValues: true,
  isPure: true,
  onConstruct: true,
  state: true,
};

/**
 * @constant {Object} IGNORED_STATIC_KEYS keys to ignore when assigning statics to a component
 */
export const IGNORED_STATIC_KEYS = {
  displayName: true,
};

/**
 * @function addPropTypeIsRequired
 *
 * @description
 * add the isRequired method to the propType
 *
 * @param {function} propType the propType checker
 * @returns {function} the propType with the isRequired function added
 */
export const addPropTypeIsRequired = (propType) =>
  (propType.isRequired = (props, key, component) =>
    props[key] == null // eslint-disable-line eqeqeq
      ? new Error(`The prop \`${key}\` is marked as required in \`${component}\`, but its value is \`${props[key]}\`.`)
      : propType(props, key, component)) && propType;

/**
 * @function bindSetState
 *
 * @description
 * bind the setState method to the component instance to ensure it can be used in a functional way
 *
 * @param {ReactComponent} instance the instance to bind setState to
 * @returns {void}
 */
export const bindSetState = (instance) =>
  Object.prototype.hasOwnProperty.call(instance.setState, 'prototype')
    ? (instance.setState = instance.setState.bind(instance))
    : instance.setState;

/**
 * @function isClassComponent
 *
 * @description
 * is the value passed a valid react component class instance
 *
 * @param {any} value the value to test
 * @returns {boolean} is the value a react component instance
 */
export const isClassComponent = (value) => !!value && value instanceof React.Component;

/**
 * @function logInvalidInstanceError
 *
 * @description
 * notify the user that the instance passed is invalid
 *
 * @param {string} type the type of creator being called
 * @returns {void}
 */
export const logInvalidInstanceError = (type) =>
  console.error(`The instance provided for use with the ${type} is not a valid React component instance.`); // eslint-disable-line no-console

/**
 * @function createRefCreator
 *
 * @description
 * create a method that will assign a ref value to the instance passed
 *
 * @param {function} getter the function that gets the component value for the ref
 * @returns {function(ReactComponent, string): function((HTMLElement|Component)): void} the ref create
 */
export const createRefCreator = (getter) => (instance, ref) =>
  isClassComponent(instance) ? (component) => (instance[ref] = getter(component)) : logInvalidInstanceError('ref');

/**
 * @function getNamespacedRef
 *
 * @description
 * get the ref that is a combination of the raw component and the component's underlying HTML element
 *
 * @param {ReactComponent} component the component to assin
 * @returns {{component: ReactComponent, element: HTMLElement}} the namespaced ref
 */
export const getNamespacedRef = (component) => ({
  component,
  element: findDOMNode(component),
});

/**
 * @function identity
 *
 * @description
 * return the first parameter passed
 *
 * @param {any} value the value to pass through
 * @returns {any} the first parameter passed
 */
export const identity = (value) => value;
