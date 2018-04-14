# react-parm CHANGELOG

## 2.1.0

* Add [`createPropType`](README.md#createproptype) method
* Fix references to github in `package.json`

## 2.0.1

* Prevent unnecessary re-binding of `setState` on instance
* Ensure `setState` is bound when using `createRender` (and by extension, `createComponent`)

## 2.0.0

#### BREAKING CHANGES

* Component functions used with `createComponent` now uses `createRender`, which accepts props as the first argument (not the full instance)

#### NEW FEATURES

* Add [`createRender`](README.md#createrender) method

## 1.1.1

* Use ES5 version of component class extension (smaller footprint)

## 1.1.0

* Add [`createComponent`](README.md#createcomponent) method

## 1.0.0

* Initial release
