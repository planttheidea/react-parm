// external dependencies
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
