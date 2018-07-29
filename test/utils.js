// test
import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if addPropTypeIsRequired will add an isRequired method to the propType that will call propType when existy', (t) => {
  const propType = sinon.spy();

  const result = utils.addPropTypeIsRequired(propType);

  t.is(typeof result.isRequired, 'function');

  const args = [{key: 'value'}, 'key', 'component'];

  result.isRequired(...args);

  t.true(propType.calledOnce);
  t.true(propType.calledWith(...args));
});

test('if addPropTypeIsRequired will add an isRequired method to the propType that will return an error when not existy', (t) => {
  const propType = sinon.spy();

  const result = utils.addPropTypeIsRequired(propType);

  t.is(typeof result.isRequired, 'function');

  const args = ['props', 'key', 'component'];

  const error = result.isRequired(...args);

  t.true(propType.notCalled);
  t.true(error instanceof Error);
});

test('if bindMethods will bind each of the boundable methods to the instance', (t) => {
  const instance = {
    forceUpdate() {},
    setState() {},
  };

  Object.keys(instance).forEach((method) => {
    t.true(Object.prototype.hasOwnProperty.call(instance[method], 'prototype'));
  });

  utils.bindMethods(instance);

  Object.keys(instance).forEach((method) => {
    t.false(Object.prototype.hasOwnProperty.call(instance[method], 'prototype'));
  });
});

test('if bindMethods will not bind the bindable methods if they arealready bound', (t) => {
  const instance = {
    forceUpdate() {},
    setState() {},
  };

  const {forceUpdate, setState} = instance;

  instance.setState = instance.setState.bind(instance);

  forceUpdate.bind = sinon.stub().callsFake((...args) => Function.prototype.bind.apply(instance.forceUpdate, ...args));

  setState.bind = sinon.stub().callsFake((...args) => Function.prototype.bind.apply(instance.setState, ...args));

  utils.bindMethods(instance);

  t.true(forceUpdate.bind.calledOnce);

  t.true(setState.bind.notCalled);
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
    element: 'foo',
  };
  const stub = sinon.stub(ReactDOM, 'findDOMNode').returns(component.element);

  const result = utils.getNamespacedRef(component);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(component));

  stub.restore();

  t.deepEqual(result, {
    component,
    element: component.element,
  });
});

test('if identity returns the first arg passed', (t) => {
  const args = [{}, {}, {}];

  const result = utils.identity(...args);

  t.is(result, args[0]);
});
