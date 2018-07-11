# react-parm CHANGELOG

## 2.6.0

- Add support for curried calls to `createComponent`

## 2.5.0

- Add support for [render props](https://reactjs.org/docs/render-props.html) instance methods via `createComponent` by setting static `isRenderProps` property to `true` on the method
- Add [`createRenderProps`](README.md#createrenderprops) method
- Add passing of `args` for `createRender` method

## 2.4.0

- Add support for additional render methods via `createComponent` by setting static `isRender` property to `true` on the method

## 2.3.0

- Add support in `createComponent` for re-assigning any static value / method applied to the source component

## 2.2.0

- Add [`createValue`](README.md#createvalue) method
- Add `getInitialValues` and `onConstruct` as additional options to `createComponent`

## 2.1.0

- Add [`createPropType`](README.md#createproptype) method
- Fix references to github in `package.json`

## 2.0.1

- Prevent unnecessary re-binding of `setState` on instance
- Ensure `setState` is bound when using `createRender` (and by extension, `createComponent`)

## 2.0.0

#### BREAKING CHANGES

- Component functions used with `createComponent` now uses `createRender`, which accepts props as the first argument (not the full instance)

#### NEW FEATURES

- Add [`createRender`](README.md#createrender) method

## 1.1.1

- Use ES5 version of component class extension (smaller footprint)

## 1.1.0

- Add [`createComponent`](README.md#createcomponent) method

## 1.0.0

- Initial release
