import PropTypes from 'prop-types';
import React, {
  Component,
  PureComponent
} from 'react';
import {render} from 'react-dom';
import {hot} from 'react-hot-loader';
import styled from 'styled-components';

import {
  createCombinedRef,
  createComponent,
  createComponentRef,
  createElementRef,
  createMethod,
  createPropType,
  createRender,
  createValue
} from '../src';

class Button extends PureComponent {
  static displayName = 'Button';
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const {children, ...props} = this.props;

    return <button {...props}>{children}</button>;
  }
}

const StyledButton = styled(Button)`
  display: block;
`;

const SpanFunctional = ({children, ...props}) => <span {...props}>{children}</span>;

SpanFunctional.propTypes = {
  children: PropTypes.node.isRequired,
};

class Span extends PureComponent {
  static displayName = 'Span';
  static propTypes = {
    children: PropTypes.node,
  };

  render = createRender(this, SpanFunctional);
}

const componentDidMount = (instance) => console.log(instance);

const shouldComponentUpdate = ({state}) => typeof state.counter === 'number' && state.counter % 2 === 0;

const componentDidUpdate = (instance, [previousProps, previousState], [constantValue]) => {
  console.log(previousProps, previousState, constantValue);
};

const getInitialValues = (instance) => {
  console.log('initial values', instance);

  return {
    length: instance.props.foo.length,
  };
};

const onClickIncrementCounter = (instance, [event]) => {
  console.log(instance);
  console.log(event.currentTarget);

  instance.random = Math.random();

  return instance.setState(({counter}) => ({
    counter: counter + 1,
  }));
};

const onClickForceUpdate = ({forceUpdate}) => console.log('forcing update') || forceUpdate();

const RenderProp = ({children}) => <div>{children({render: 'prop'})}</div>;

RenderProp.propTypes = {
  children: PropTypes.func.isRequired,
};

const renderPropMethod = (props, instance) => {
  console.group('render props');
  console.log('render props', props);
  console.log('instance props', instance.props);
  console.groupEnd('render props');

  return <span>Render prop: {props.render}</span>;
};

renderPropMethod.isRenderProps = true;

const Generated = (props, instance) => {
  console.log('render instance', instance);

  return (
    <div>
      <Span>Props: {JSON.stringify(props)}</Span>

      <RenderProp>{instance.renderPropMethod}</RenderProp>
    </div>
  );
};

Generated.defaultProps = {
  foo: 'bar',
};

Generated.staticFoo = 'bar';
Generated.staticBar = () => 'baz';

const GeneratedParm = createComponent(Generated, {
  componentDidMount,
  getInitialState({props}) {
    return {
      baz: props.foo,
    };
  },
  getInitialValues,
  isPure: true,
  onConstruct(instance) {
    console.log('constructed', instance);
  },
  renderPropMethod,
});

console.log('static value', GeneratedParm.staticFoo);
console.log('static function', GeneratedParm.staticBar);

const GeneratedParmCurried = createComponent({componentDidMount})({getInitialValues})(Generated, {
  getInitialState: ({props}) => ({baz: props.foo}),
  isPure: true,
  onConstruct: (instance) => console.log('constructed curried', instance),
  renderPropMethod,
});

const isFoo = createPropType((checker) => {
  const {component, name, value} = checker;

  console.log('standard prop type', checker);

  return value === 'foo'
    ? null
    : new Error(`The prop "${name}" is "${value}" in ${component}, when it should be "foo"!`);
});

const isMultipleOfFoo = createPropType((checker) => {
  const {component, key, name, value} = checker;

  console.log('of prop type', checker);

  return value === 'foo'
    ? null
    : new Error(`The key "${key}" for prop "${name}" is "${value}" in ${component}, when it should be "foo"!`);
});

class App extends Component {
  static propTypes = {
    custom: isFoo.isRequired,
    customArrayOf: PropTypes.arrayOf(isMultipleOfFoo).isRequired,
    customObjectOf: PropTypes.objectOf(isMultipleOfFoo).isRequired,
  };

  state = {
    counter: 0,
  };

  componentDidMount = createMethod(this, componentDidMount);
  shouldComponentUpdate = createMethod(this, shouldComponentUpdate);
  componentDidUpdate = createMethod(this, componentDidUpdate, 'SOME_CONSTANT_VALUE');

  button = null;
  header = null;
  random = createValue(this, (instance) => {
    console.log('random value', instance, instance.state.counter);

    return instance.state.counter;
  });
  span = null;

  onClickForceUpdate = createMethod(this, onClickForceUpdate);
  onClickIncrementCounter = createMethod(this, onClickIncrementCounter);

  render() {
    return (
      <div>
        <h1 ref={createElementRef(this, 'header')}>App</h1>

        <StyledButton
          onClick={this.onClickIncrementCounter}
          ref={createComponentRef(this, 'button')}
        >
          Click to increment the counter
        </StyledButton>

        <StyledButton onClick={this.onClickForceUpdate}>Click to force an update</StyledButton>

        <br />

        <GeneratedParm bar="baz" />

        <br />

        <GeneratedParmCurried bar="baz" />

        <br />

        <br />

        <Span ref={createCombinedRef(this, 'span')}>{this.state.counter}</Span>
      </div>
    );
  }
}

createMethod(() => {});
createRender(() => {});
createValue(() => {});

export default hot(module)(App);
