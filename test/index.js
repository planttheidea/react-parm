// test
import test from 'ava';
import PropTypes from 'prop-types';
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

test('if createComponent will create a standard component class with static state', (t) => {
  const componentDidMount = sinon.spy();

  const state = {
    foo: 'quz'
  };

  const Generated = ({state}) => <div>{state.foo}</div>;

  Generated.displayName = 'DisplayName';

  Generated.propTypes = {
    bar: PropTypes.string,
    foo: PropTypes.string
  };

  Generated.defaultProps = {
    bar: 'baz'
  };

  const value = {};

  const GeneratedParm = index.createComponent(Generated, {
    componentDidMount,
    state,
    value
  });

  t.is(GeneratedParm.displayName, Generated.displayName);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="foo" />, div);
});

test('if createComponent will create a pure component class with derived state', (t) => {
  const componentDidMount = sinon.spy();

  const state = {
    foo: 'quz'
  };

  componentDidMount.resetHistory();

  const Generated = ({state}) => <div>{state.foo}</div>;

  Generated.displayName = 'PureDisplayName';
  Generated.propTypes = {};
  Generated.defaultProps = {};

  const GeneratedParm = index.createComponent(Generated, {
    componentDidMount,
    getInitialState() {
      return state;
    },
    isPure: true
  });

  t.is(GeneratedParm.displayName, Generated.displayName);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="buzz" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(componentDidMount.args[0][0].constructor, GeneratedParm);
});

test('if createComponent will create a component class when no options are passed', (t) => {
  const Generated = ({props}) => <div>{props.foo}</div>;

  try {
    index.createComponent(Generated);

    t.pass();
  } catch (error) {
    t.fail(error);
  }
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
