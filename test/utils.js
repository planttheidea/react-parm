// test
import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if bindSetState will bind the setState method to the instance', (t) => {
  const instance = {
    setState() {}
  };

  t.true(Object.prototype.hasOwnProperty.call(instance.setState, 'prototype'));

  utils.bindSetState(instance);

  t.false(Object.prototype.hasOwnProperty.call(instance.setState, 'prototype'));
});

test('if isClassComponent will return false when the value is falsy', (t) => {
  const value = null;

  t.false(utils.isClassComponent(value));
});

test('if isClassComponent will return false when the value is not an instance of a react component', (t) => {
  const value = () => <div />;

  t.false(utils.isClassComponent(value));
});

test('if isClassComponent will return true when the value is an instance of a react component', (t) => {
  class Value extends React.Component {
    componentDidMount() {
      t.true(utils.isClassComponent(this));
    }

    render() {
      return <div />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if logInvalidInstanceError will log the type to the console error', (t) => {
  const type = 'foo';

  const stub = sinon.stub(console, 'error');

  utils.logInvalidInstanceError(type);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(`The instance provided for use with the ${type} is not a valid React component instance.`));

  stub.restore();
});

test('if createRefCreator will accept a getter and return a method that will assign a ref if a valid class component', (t) => {
  const getter = sinon.stub().returnsArg(0);

  class Value extends React.Component {
    componentDidMount() {
      const getRef = utils.createRefCreator(getter)(this, 'ref');

      t.is(typeof getRef, 'function');

      const component = {};

      const ref = getRef(component);

      t.true(getter.calledOnce);
      t.true(getter.calledWith(component));

      t.is(ref, component);
    }

    render() {
      return <div />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if createRefCreator will log the error if the component instance if not valid', (t) => {
  const getter = sinon.stub().returnsArg(0);
  const stub = sinon.stub(console, 'error');

  utils.createRefCreator(getter)(() => {});

  t.true(stub.calledOnce);

  stub.restore();
});

test('if getNamespacedRef will return both the component and the element on the namespace', (t) => {
  const component = {
    element: 'foo'
  };
  const stub = sinon.stub(ReactDOM, 'findDOMNode').returns(component.element);

  const result = utils.getNamespacedRef(component);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(component));

  stub.restore();

  t.deepEqual(result, {
    component,
    element: component.element
  });
});

test('if identity returns the first arg passed', (t) => {
  const args = [{}, {}, {}];

  const result = utils.identity(...args);

  t.is(result, args[0]);
});
