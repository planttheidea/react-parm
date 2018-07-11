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
    foo: 'quz',
  };

  const Generated = function Generated(props, instance) {
    t.deepEqual(instance.state, state);

    return <div>{instance.state.foo}</div>;
  };

  Generated.displayName = 'DisplayName';

  Generated.propTypes = {
    bar: PropTypes.string,
    foo: PropTypes.string,
  };

  Generated.defaultProps = {
    bar: 'baz',
  };

  const value = {};

  const GeneratedParm = index.createComponent(Generated, {
    componentDidMount,
    state,
    value,
  });

  t.is(GeneratedParm.displayName, Generated.displayName);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="foo" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(GeneratedParm.prototype.constructor, React.Component.prototype.constructor);
});

test('if createComponent will create a pure component class with derived state', (t) => {
  const componentDidMount = sinon.spy();

  const state = {
    foo: 'quz',
  };

  const Generated = function Generated(props, instance) {
    t.deepEqual(instance.state, state);

    return <div>{instance.state.foo}</div>;
  };

  Generated.propTypes = {};
  Generated.defaultProps = {};

  const options = {
    componentDidMount,
    getInitialState: sinon.stub().callsFake(() => state),
    isPure: true,
  };

  const GeneratedParm = index.createComponent(Generated, options);

  t.is(GeneratedParm.displayName, Generated.name);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="buzz" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(GeneratedParm.prototype.constructor, React.PureComponent.prototype.constructor);

  t.true(options.getInitialState.calledOnce);
});

test('if createComponent will create a component class when no options are passed', (t) => {
  const Generated = ({foo}) => <div>{foo}</div>;

  delete Generated.name;

  Generated.propTypes = {
    foo: PropTypes.string,
  };

  try {
    const GeneratedParm = index.createComponent(Generated);

    t.is(GeneratedParm.displayName, 'ParmComponent');

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if createComponent will create a pure component class with derived values', (t) => {
  const componentDidMount = sinon.spy();

  const values = {
    foo: 'quz',
  };

  componentDidMount.resetHistory();

  const Generated = function Generated(props, instance) {
    t.is(instance.foo, values.foo);

    return <div>{instance.foo}</div>;
  };

  Generated.propTypes = {};
  Generated.defaultProps = {};

  const options = {
    componentDidMount,
    getInitialValues: sinon.stub().callsFake(() => values),
    isPure: true,
  };

  const GeneratedParm = index.createComponent(Generated, options);

  t.is(GeneratedParm.displayName, Generated.name);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="buzz" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(GeneratedParm.prototype.constructor, React.PureComponent.prototype.constructor);

  t.true(options.getInitialValues.calledOnce);
});

test('if createComponent will create a pure component class without derived values if they are not returned', (t) => {
  const componentDidMount = sinon.spy();

  const values = null;

  componentDidMount.resetHistory();

  const Generated = function Generated(props, instance) {
    t.is(instance.foo, undefined);

    return <div>{instance.foo}</div>;
  };

  Generated.propTypes = {};
  Generated.defaultProps = {};

  const options = {
    componentDidMount,
    getInitialValues: sinon.stub().callsFake(() => values),
    isPure: true,
  };

  const GeneratedParm = index.createComponent(Generated, options);

  t.is(GeneratedParm.displayName, Generated.name);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="buzz" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(GeneratedParm.prototype.constructor, React.PureComponent.prototype.constructor);

  t.true(options.getInitialValues.calledOnce);
});

test('if createComponent will create a pure component class without derived values if they are not an object', (t) => {
  const componentDidMount = sinon.spy();

  const values = 'values';

  componentDidMount.resetHistory();

  const Generated = function Generated(props, instance) {
    t.is(instance.foo, undefined);

    return <div>{instance.foo}</div>;
  };

  Generated.propTypes = {};
  Generated.defaultProps = {};

  const options = {
    componentDidMount,
    getInitialValues: sinon.stub().callsFake(() => values),
    isPure: true,
  };

  const GeneratedParm = index.createComponent(Generated, options);

  t.is(GeneratedParm.displayName, Generated.name);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="buzz" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(GeneratedParm.prototype.constructor, React.PureComponent.prototype.constructor);

  t.true(options.getInitialValues.calledOnce);
});

test('if createComponent will create a pure component class calling onConstruct when passed', (t) => {
  const componentDidMount = sinon.spy();

  componentDidMount.resetHistory();

  const Generated = function Generated(props, instance) {
    return <div />;
  };

  Generated.propTypes = {};
  Generated.defaultProps = {};

  const options = {
    componentDidMount,
    isPure: true,
    onConstruct: sinon.spy(),
  };

  const GeneratedParm = index.createComponent(Generated, options);

  t.is(GeneratedParm.displayName, Generated.name);
  t.is(GeneratedParm.propTypes, Generated.propTypes);
  t.is(GeneratedParm.defaultProps, Generated.defaultProps);

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="buzz" />, div);

  t.true(componentDidMount.calledOnce);
  t.is(GeneratedParm.prototype.constructor, React.PureComponent.prototype.constructor);

  t.true(options.onConstruct.calledOnce);
});

test('if createComponent will reassign static values and functions to the generated component', (t) => {
  const Generated = ({foo}) => <div>{foo}</div>;

  Generated.propTypes = {
    foo: PropTypes.string,
  };

  Generated.value = 'value';
  Generated.fn = () => {};

  try {
    const GeneratedParm = index.createComponent(Generated);

    t.is(GeneratedParm.propTypes, Generated.propTypes);
    t.is(GeneratedParm.value, Generated.value);
    t.is(GeneratedParm.fn, Generated.fn);

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if createComponent will create a component class with render methods if they have isRender set to true', (t) => {
  const Generated = (props, {renderer}) => renderer(props);

  Generated.propTypes = {
    foo: PropTypes.string,
  };

  const renderer = ({foo}) => <div>{foo}</div>;

  renderer.isRender = true;

  const GeneratedParm = index.createComponent(Generated, {
    renderer,
  });

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="foo" />, div);

  t.is(div.innerHTML, '<div>foo</div>');
});

test('if createComponent will create a component class with render props methods if they have isRenderProps set to true', (t) => {
  const RenderProp = ({children}) => <div>{children({render: 'prop'})}</div>;

  RenderProp.propTypes = {
    children: PropTypes.func.isRequired,
  };

  const renderPropMethod = (props, instance) => <span>Render prop: {props.render}</span>;

  renderPropMethod.isRenderProps = true;

  const Generated = (props, instance) => <RenderProp>{instance.renderPropMethod}</RenderProp>;

  Generated.propTypes = {
    foo: PropTypes.string,
  };

  const GeneratedParm = index.createComponent(Generated, {
    renderPropMethod,
  });

  const div = document.createElement('div');

  ReactDOM.render(<GeneratedParm foo="foo" />, div);

  t.is(div.innerHTML, '<div><span>Render prop: prop</span></div>');
});

test('if createComponent will curry the calls when render is not a function', (t) => {
  const componentDidMount = () => console.log('mounted');
  const componentDidUpdate = () => console.log('updated');

  const Result = index.createComponent({componentDidMount})()({componentDidUpdate})()((props) => (
    <div>{JSON.stringify(props)}</div>
  ));

  const div = document.createElement('div');

  ReactDOM.render(<Result foo="foo" />, div);

  t.is(div.innerHTML, '<div>{"foo":"foo"}</div>');
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

test('if createRender will create a render method that receives props and the instance', (t) => {
  const render = (props, instance) => {
    t.is(props, instance.props);
    t.is(props.bar, 'baz');

    return null;
  };

  class Foo extends React.Component {
    render = index.createRender(this, render);
  }

  const div = document.createElement('div');

  ReactDOM.render(<Foo bar="baz" />, div);
});

test('if createRender will log the error when not a valid instance', (t) => {
  const stub = sinon.stub(utils, 'logInvalidInstanceError');

  index.createRender(() => {}, () => {});

  t.true(stub.calledOnce);
  t.true(stub.calledWith('render'));

  stub.restore();
});

test('if createRenderProps will create a render props method that receives props and the instance', (t) => {
  const passedProps = {passed: 'props'};

  const RenderProp = ({children}) => <div>{children(passedProps)}</div>;

  RenderProp.propTypes = {
    children: PropTypes.func.isRequired,
  };

  const renderProps = (props, instance) => {
    t.is(props, passedProps);
    t.is(instance.props.bar, 'baz');

    return null;
  };

  class Foo extends React.Component {
    renderProps = index.createRenderProps(this, renderProps);

    render() {
      return <RenderProp>{this.renderProps}</RenderProp>;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Foo bar="baz" />, div);
});

test('if createRenderProps will log the error when not a valid instance', (t) => {
  const stub = sinon.stub(utils, 'logInvalidInstanceError');

  index.createRenderProps(() => {}, () => {});

  t.true(stub.calledOnce);
  t.true(stub.calledWith('render props'));

  stub.restore();
});

test('if createPropType will create a custom prop type validator for a standard prop', (t) => {
  const handler = sinon.spy();

  const result = index.createPropType(handler);

  t.is(typeof result, 'function');
  t.is(typeof result.isRequired, 'function');

  const args = [{key: 'value'}, 'key', 'Component'];

  result(...args);

  t.true(handler.calledOnce);
  t.true(
    handler.calledWith({
      component: args[2],
      key: args[1],
      name: args[1],
      path: args[1],
      props: args[0],
      value: args[0][args[1]],
    })
  );
});

test('if createValue will create a value based on a method that receives the instance', (t) => {
  const getLength = (instance) => {
    t.is(instance.props.bar, 'baz');

    return instance.props.bar.length;
  };

  class Foo extends React.Component {
    length = index.createValue(this, getLength);

    render() {
      t.is(this.length, 3);

      return <div />;
    }
  }

  const div = document.createElement('div');

  ReactDOM.render(<Foo bar="baz" />, div);
});

test('if createValue will log the error when not a valid instance', (t) => {
  const stub = sinon.stub(utils, 'logInvalidInstanceError');

  index.createValue(() => {}, () => {});

  t.true(stub.calledOnce);
  t.true(stub.calledWith('value'));

  stub.restore();
});

test('if createPropType will create a custom prop type validator for a standard prop', (t) => {
  const handler = sinon.spy();

  const result = index.createPropType(handler);

  t.is(typeof result, 'function');
  t.is(typeof result.isRequired, 'function');

  const args = [{key: 'value'}, 'key', 'Component'];

  result(...args);

  t.true(handler.calledOnce);
  t.true(
    handler.calledWith({
      component: args[2],
      key: args[1],
      name: args[1],
      path: args[1],
      props: args[0],
      value: args[0][args[1]],
    })
  );
});

test('if createPropType will create a custom prop type validator for a nested prop', (t) => {
  const handler = sinon.spy();

  const result = index.createPropType(handler);

  t.is(typeof result, 'function');
  t.is(typeof result.isRequired, 'function');

  const args = [{key: 'value'}, 'key', 'Component', 'location', 'higher.key'];

  result(...args);

  t.true(handler.calledOnce);
  t.true(
    handler.calledWith({
      component: args[2],
      key: args[1],
      name: args[4].split('.')[0],
      path: args[4],
      props: args[0],
      value: args[0][args[1]],
    })
  );
});
