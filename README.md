# react-parm

Handle react classes with more functional purity

## Table of contents

* [Summary](#summary)
* [Usage](#usage)
* [Methods](#methods)
  * [createMethod](#createmethod)
  * [createComponentRef](#createcomponentref)
  * [createElementRef](#createelementref)
  * [createCombinedRef](#createcombinedref)
* [Development](#development)

## Summary

`react-parm` is a thin abstraction (690 bytes minified and gzipped) providing partial-application methods that allow you to handle `react` classes with much more functional purity. This allows for better encapsulation, greater separation of concerns, and simplified testing. When combined with destructuring, it also improves readability and comprehension.

## Usage

```javascript
import React from "react";
import { createElementRef, createMethod } from "react-parm";

export const componentDidMount = ({ getFoo, props }) => {
  if (props.shouldGetFoo) {
    getFoo();
  }
};

export const onClickGetBar = ({ getBar }, [event]) => {
  getBar(event.currentTarget.dataset.baz);
};

export default class App extends React.Component {
  // lifecycle methods
  componentDidMount = createMethod(this, componentDidMount);

  // refs
  element = null;

  // instance methods
  onClickGetBar = createMethod(this, onClickGetBar);

  render() {
    return (
      <button
        data-baz="quz"
        onClick={this.onClickGetBar}
        ref={createElementRef(this, "element")}
      >
        Let's get bar!
      </button>
    );
  }
}
```

## Methods

#### createMethod

Create a bound instance or lifecycle method, which will receive the full instance as the first parameter.

_createMethod(instance: ReactComponent, method: function, ...extraArgs: Array<any>): (instance: Object, args: Array<any>, extraArgs: Array<any>) => any_

```javascript
import React from "react";
import { createMethod } from "react-parm";

export const componentDidMount = ({ setState }) =>
  setState(() => ({ isMounted: true }));

export const onClickDoThing = ({ props }, [event], [withStuff]) =>
  props.doThing(event.currentTarget, withStuff);

export default class App extends Component {
  state = {
    isMounted: false
  };

  componentDidMount = createMethod(this, componentDidMount);
  onClickDoThing = createMethod(this, onClickDoThing, true);

  render() {
    return (
      <div>
        <h3>Both lifecycle and instance methods are supported!</h3>

        <button onClick={this.onClickDoThing}>Do the thing</button>
      </div>
    );
  }
}
```

There are three parameters passed to the `method` you provide as the second parameter:

* instance `ReactComponent` => the `react` component instance
* args `Array<any>` => the array of arguments passed to the method directly
* extraArgs `Array<any>` => an array of any additional arguments passed to `createMethod` on instantiation

If you return something from this method, it shall be respected.

#### createComponentRef

Create a method that will assign the Component requested to an instance value using a ref callback.

_createComponentRef(instance: ReactComponent, ref: string): (component: HTMLElement | ReactComponent) => void_

```javascript
import React from "react";
import { createElementRef } from "react-parm";

export default class App extends Component {
  component = null;

  render() {
    return (
      <SomeOtherComponent ref={createComponentRef(this, "component")}>
        Let's capture the component instance!
      </SomeOtherComponent>
    );
  }
}
```

The `ref` string value passed will be the key that will be used in the assignment to the `instance`.

#### createElementRef

Create a method that will assign the DOM node of the component requested to an instance value using a ref callback.

_createElementRef(instance: ReactComponent, ref: string): (component: HTMLElement | ReactComponent) => void_

```javascript
import React from "react";
import { createElementRef } from "react-parm";

export default class App extends Component {
  element = null;

  render() {
    return (
      <SomeOtherComponent ref={createElementRef(this, "element")}>
        Let's find the DOM node!
      </SomeOtherComponent>
    );
  }
}
```

The `ref` string value passed will be the key that will be used in the assignment to the `instance`.

#### createCombinedRef

Create a method that will assign both the DOM node of the component requested and the component itself to a namespaced instance value using a ref callback.

_createCombinedRef(instance: ReactComponent, ref: string): (component: HTMLElement | ReactComponent) => void_

```javascript
import React from "react";
import { createCombinedRef } from "react-parm";

export default class App extends Component {
  someOtherComponent = null;

  render() {
    return (
      <SomeOtherComponent ref={createCombinedRef(this, "someOtherComponent")}>
        I have the best of both worlds! this.someOtherComponent will look like "{component: SomeOtherComponent, element: div}".
      </SomeOtherComponent>
    );
  }
}
```

The value assigned will be an object with `component` and `element` properties, which reflect the component and the DOM node for that component respectively. The `ref` string value passed will be the key that will be used in the assignment to the `instance`.

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

* `build` => run rollup to build development and production `dist` files
* `dev` => run webpack dev server to run example app / playground
* `lint` => run ESLint against all files in the `src` folder
* `lint: fix` => runs `lint` with `--fix`
* `prepublish` => runs `prepublish:compile` when publishing
* `prepublish:compile` => run `lint`, `test:coverage`, `transpile:lib`, `transpile:es`, and `build`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
