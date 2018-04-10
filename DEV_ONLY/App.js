import PropTypes from 'prop-types';
import React, {Component, PureComponent} from 'react';
import {hot} from 'react-hot-loader';
import styled from 'styled-components';

import {createCombinedRef, createComponent, createComponentRef, createElementRef, createMethod} from '../src';

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

class Span extends PureComponent {
  static displayName = 'Span';
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const {children, ...props} = this.props;

    return <span {...props}>{children}</span>;
  }
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

const Generated = ({props}) => <div>Props: {JSON.stringify(props)}</div>;

Generated.defaultProps = {
  foo: 'bar'
};

const GeneratedParm = createComponent(Generated, {
  componentDidMount,
  getInitialState({props}) {
    return {
      baz: props.foo
    };
  }
});

class App extends Component {
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

export default hot(module)(App);
