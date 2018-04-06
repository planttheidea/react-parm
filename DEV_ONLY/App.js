import PropTypes from 'prop-types';
import React, {Component, PureComponent} from 'react';
import {hot} from 'react-hot-loader';
import styled from 'styled-components';

import {createCombinedRef, createComponentRef, createElementRef, createMethod} from '../src';

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

const render = (instance) => (
  <div>
    <h1 ref={createElementRef(instance, 'header')}>App</h1>

    <StyledButton
      onClick={instance.onClickIncrementCounter}
      ref={createComponentRef(instance, 'button')}
    >
      Click to increment the counter
    </StyledButton>

    <br />
    <br />
    <br />

    <Span ref={createCombinedRef(instance, 'span')}>{instance.state.counter}</Span>
  </div>
);

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

  render = createMethod(this, render);
}

createMethod(() => {});

export default hot(module)(App);
