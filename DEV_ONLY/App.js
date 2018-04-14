import PropTypes from 'prop-types';
import React, {Component, PureComponent} from 'react';
import {hot} from 'react-hot-loader';
import styled from 'styled-components';

import {
  createCombinedRef,
  createComponent,
  createComponentRef,
  createElementRef,
  createMethod,
  createPropType,
  createRender
} from '../src';

class Button extends PureComponent {
  static displayName = 'Button';
  static propTypes = {
    children: PropTypes.node
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
  children: PropTypes.node.isRequired
};

class Span extends PureComponent {
  static displayName = 'Span';
  static propTypes = {
    children: PropTypes.node
  };

  render = createRender(this, SpanFunctional);
}

const componentDidMount = (instance) => console.log(instance);

const shouldComponentUpdate = ({state}) => typeof state.counter === 'number' && state.counter % 2 === 0;

const componentDidUpdate = (instance, [previousProps, previousState], [constantValue]) =>
  console.log(previousProps, previousState, constantValue);

const onClickIncrementCounter = (instance, [event]) => {
  console.log(instance);
  console.log(event.currentTarget);

  instance.random = Math.random();

  return instance.setState(({counter}) => ({
    counter: counter + 1
  }));
};

const Generated = (props, instance) => {
  console.log('render instance', instance);

  return <Span>Props: {JSON.stringify(props)}</Span>;
};

Generated.defaultProps = {
  foo: 'bar'
};

const GeneratedParm = createComponent(Generated, {
  componentDidMount,
  getInitialState({props}) {
    return {
      baz: props.foo
    };
  },
  isPure: true
});

const isFoo = createPropType(
  ({component, key, value}) =>
    value === 'foo' ? null : new Error(`The key ${key} is "${value}" in ${component}, when it should be "foo"!`)
);

class App extends Component {
  static propTypes = {
    custom: isFoo.isRequired
  };

  state = {
    counter: 0
  };

  componentDidMount = createMethod(this, componentDidMount);
  shouldComponentUpdate = createMethod(this, shouldComponentUpdate);
  componentDidUpdate = createMethod(this, componentDidUpdate, 'SOME_CONSTANT_VALUE');

  button = null;
  header = null;
  random = 0;
  span = null;

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

        <br />

        <GeneratedParm bar="baz" />
        <br />

        <br />

        <Span ref={createCombinedRef(this, 'span')}>{this.state.counter}</Span>
      </div>
    );
  }
}

createMethod(() => {});
createRender(() => {});

export default hot(module)(App);
