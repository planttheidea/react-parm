// test
import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

// src
import * as index from 'src/index';
import * as utils from 'src/utils';

test('if createCombinedRef will create a ref method that assigns the combined ref to the instance', (t) => {
  class OtherValue extends React.Component {
    render() {
      return <div />;
    }
  }

  class Value extends React.Component {
    componentDidMount() {
      t.true(this.ref.hasOwnProperty('component'));
      t.true(this.ref.component instanceof OtherValue);

      t.true(this.ref.hasOwnProperty('element'));
      t.true(this.ref.element instanceof HTMLElement);
    }

    ref = null;

    render() {
      return <OtherValue ref={index.createCombinedRef(this, 'ref')} />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if createComponentRef will create a ref method that assigns the component ref to the instance', (t) => {
  class OtherValue extends React.Component {
    render() {
      return <div />;
    }
  }

  class Value extends React.Component {
    componentDidMount() {
      t.true(this.ref instanceof OtherValue);
    }

    ref = null;

    render() {
      return <OtherValue ref={index.createComponentRef(this, 'ref')} />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if createElementRef will create a ref method that assigns the element ref to the instance', (t) => {
  class OtherValue extends React.Component {
    render() {
      return <div />;
    }
  }

  class Value extends React.Component {
    componentDidMount() {
      t.true(this.ref instanceof HTMLElement);
    }

    ref = null;

    render() {
      return <OtherValue ref={index.createElementRef(this, 'ref')} />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if createMethod will create an instance method that accepts the instance as a parameter', (t) => {
  const spy = sinon.spy();

  class Value extends React.Component {
    componentWillMount = index.createMethod(this, spy);

    render() {
      t.true(spy.calledOnce);
      t.true(spy.calledWith(this, [], []));

      return <div />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if createMethod will create an instance method that accepts additional parameters', (t) => {
  const spy = sinon.spy();
  const customValue = 'CUSTOM_VALUE';

  class Value extends React.Component {
    componentWillMount = index.createMethod(this, spy, customValue);

    render() {
      t.true(spy.calledOnce);
      t.true(spy.calledWith(this, [], [customValue]));

      return <div />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Value />, div);
});

test('if createMethod will log the error when not a valid instance', (t) => {
  const stub = sinon.stub(utils, 'logInvalidInstanceError');

  index.createMethod(() => {}, () => {});

  t.true(stub.calledOnce);
  t.true(stub.calledWith('method'));

  stub.restore();
});
