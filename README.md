# react-parm

Handle react classes with more functional purity

## Table of contents

* [Summary](#summary)
* [Usage](#usage)
* [Methods](#methods)
  * [createMethod](#createmethod)
  * [createValue](#createvalue)
  * [createRender](#createrender)
  * [createComponent](#createcomponent)
  * [createComponentRef](#createcomponentref)
  * [createElementRef](#createelementref)
  * [createCombinedRef](#createcombinedref)
  * [createPropType](#createproptype)
* [Why parm?](#why-parm)
* [Development](#development)

## Summary

`react-parm` is a thin abstraction providing partial-application methods that allow you to handle `react` classes with much more functional purity. This allows for better encapsulation, greater separation of concerns, and simplified testing. When combined with destructuring, it also improves readability and comprehension.

## Usage

```javascript
import React from "react";
import { createElementRef, createMethod } from "react-parm";

export const componentDidMount = ({ getFoo, props }) =>
  props.shouldGetFoo && getFoo();

export const onClickGetBar = ({ getBar }, [event]) =>
  getBar(event.currentTarget.dataset.baz);

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
        Go get bar!
      </button>
    );
  }
}
```

## Methods

#### createMethod

Create a functional instance or lifecycle method, which will receive the full instance as the first parameter.

_createMethod(instance: ReactComponent, method: function, ...extraArgs: Array<any>): (instance: ReactComponent, args: Array<any>, extraArgs: Array<any>) => any_

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
        <h3>Welcome to doing the thing</h3>

        <button onClick={this.onClickDoThing}>Do the thing</button>
      </div>
    );
  }
}
```

#### createValue

Create a value to assign to the instance based on a functional method which will receive the full instance as the first parameter.

_createValue(instance: ReactComponent, method: function, ...extraArgs: Array<any>): any_

```javascript
import React from "react";
import { createValue } from "react-parm";

export const getLength = ({ props }) => {
  return props.foo.length;
};

export default class App extends Component {
  length = createValue(this, getLength);

  render() {
    return <div>The length of the foo parameter is {this.length}</div>;
  }
}
```

#### createRender

Create a functional render method, which will receive the `props` as the first parameter, and the full instance as the second parameter.

_createRender(instance: ReactComponent, render: function): (props: Object, instance: ReactComponent) => ReactElement_

```javascript
import React from "react";
import { createMethod, createRender } from "react-parm";

export const componentDidMount = ({ setState }) =>
  setState(() => ({ isMounted: true }));

export const DoTheThing = ({ doThing }, { state: { isMounted } }) => {
  return (
    <div>
      <h3>Welcome to doing the mounted thing</h3>

      <span>Am I mounted? {isMounted ? "YES!" : "No :("}</span>

      <button onClick={doThing}>Do the thing</button>
    </div>
  );
};

export default class App extends Component {
  state = {
    isMounted: false
  };

  componentDidMount = createMethod(this, componentDidMount);
  onClickDoThing = createMethod(this, onClickDoThing, true);

  render = createRender(this, DoTheThing);
}
```

**NOTE**: The difference in signature from `createMethod` is both for common-use purposes, but also because it allows linting tools to appropriately lint for `PropTypes`.

#### createComponent

Create a functional component with all available instance-based methods, values, and refs a `Component` class has.

_createComponent(render: function, options: Object): ReactComponent_

```javascript
import React from "react";
import { createComponent } from "react-parm";

export const state = {
  isMounted: false
};

export const componentDidMount = ({ setState }) =>
  setState(() => ({ isMounted: true }));

export const onClickDoThing = ({ props }, [event], [withStuff]) =>
  props.doThing(event.currentTarget, withStuff);

export const DoTheThing = ({ doThing }, { onClickDoThing }) => (
  <div>
    <h3>Welcome to doing the thing</h3>

    <button onClick={doThing && onClickDoThing}>Do the thing</button>
  </div>
);

DoTheThing.displayName = "DoTheThing";

DoTheThing.propTypes = {
  doThing: PropTypes.func.isRequired
};

export default createComponent(DoTheThing, {
  componentDidMount,
  onClickDoThing,
  state
});
```

The component will be parmed with `createRender`, all methods passed in `options` will be parmed with `createMethod`, and all other values will be assigned to the instance. There are also two additional properties that are treated outside the context of assignment to the instance:

* `isPure` => should `PureComponent` be used to construct the underlying component class instead of `Component` (defaults to `false`)
* `getInitialState` => if a method is passed, then it is parmed and used to derive the initial state instead of the static `state` property
* `getInitialValues` => If a method is passed, then it is parmed and used to derive initial instance values
  * Expects an object to be returned, where a return of `{foo: 'bar'}` will result in `instance.foo` being `"bar"`
* `onConstruct` => If a method is passed, then it is called with the instance as parameter at the end of construction

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
        We captured the component instance!
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
        We found the DOM node!
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

#### createPropType

Create a custom PropTypes validation method.

_createPropType(validator: function): (metadata: Object) => (Error|null)_

```javascript
import { createPropType } from "react-parm";

export const isFoo = createPropType(({ component, name, value }) =>
  value === "foo"
    ? null
    : new Error(
        `The prop "${name}" is "${value}" in ${component}, when it should be "foo"!`
      );
);
```

The full shape of the `metadata` object passed to `createPropType`:

```javascript
{
  component: string, // the name of the component
  key: string, // the key that is being validated
  name: string, // the name of the prop being validated
  path: string, // the full path (if nested) of the key being validated
  props: any, // the props object
  value: any // the value of the prop passed
}
```

Please note that usage may result in different values for these keys, based on whether the custom prop type is used in `arrayOf` / `objectOf` or not.

When used in `arrayOf` or `objectOf`:

* `key` represents the nested key being validated
* `name` represents the name of the prop that was passed
* `path` represents the full path being validated

Example:

```javascript
const isArrayOfFoo = createPropType(
  ({ component, key, name, path, value }) => {
    value === "foo"
      ? null
      : new Error(
          `The key "${key}" for prop "${name}" at path ${path} is "${value}" in ${component}, when it should be "foo"!`
        );
  }
);
...
<SomeComponent bar={['baz']}>
// The key "0" for prop "bar" at path "bar[0]" is "baz" in "SomeComponent", when it should be "foo"!
```

When the prop type is used in any context other than `arrayOf` / `objectOf`, then `key`, `name`, and `path` will all be the same value.

## Why parm?

PARM is an acronym, standing for Partial-Application React Method. Also, why not parm? It's delicious.

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
