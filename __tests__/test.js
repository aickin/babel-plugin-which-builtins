const babel = require('babel-core');
const babelPluginWhichBuiltins = require('..');

function getBuiltinsForCode(code) {
  const result = [];
  const transformedCode = babel.transform(code, { plugins: babelPluginWhichBuiltins }).code;
  const regex = /import "([^"]*)"/g;
  let match;
  while ((match = regex.exec(transformedCode)) !== null) {
    result.push(match[1]);
  }
  return result.sort();
}

test('test static method', () => {
  expect(getBuiltinsForCode('Array.from([1,2,3]);')).toEqual(['core-js/modules/es6.array.from','core-js/modules/es6.array.iterator']);
  expect(getBuiltinsForCode('Array.of([1,2,3]);')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.array.of']);
});

test('test computed static method', () => {
  expect(getBuiltinsForCode('Array["from"]([1,2,3]);')).toEqual(['core-js/modules/es6.array.from','core-js/modules/es6.array.iterator']);
  expect(getBuiltinsForCode('Array["of"]([1,2,3]);')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.array.of']);
});

test('test ES5 static method', () => {
  expect(getBuiltinsForCode('Array.isArray([1,2,3]);')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('test globals', () => {
  expect(getBuiltinsForCode('var foo = new regeneratorRuntime();')).toEqual(['core-js/modules/es6.array.iterator','regenerator-runtime/runtime']);
  expect(getBuiltinsForCode('var foo = new DataView();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.data-view']);
  expect(getBuiltinsForCode('var foo = new Int8Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.int8-array']);
  expect(getBuiltinsForCode('var foo = new Uint8Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.uint8-array']);
  expect(getBuiltinsForCode('var foo = new Uint8ClampedArray();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.uint8-clamped-array']);
  expect(getBuiltinsForCode('var foo = new Int16Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.int16-array']);
  expect(getBuiltinsForCode('var foo = new Uint16Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.uint16-array']);
  expect(getBuiltinsForCode('var foo = new Int32Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.int32-array']);
  expect(getBuiltinsForCode('var foo = new Uint32Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.uint32-array']);
  expect(getBuiltinsForCode('var foo = new Float32Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.float32-array']);
  expect(getBuiltinsForCode('var foo = new Float64Array();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.typed.float64-array']);
  expect(getBuiltinsForCode('var foo = new Map();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.map']);
  expect(getBuiltinsForCode('var foo = new Set();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.set']);
  expect(getBuiltinsForCode('var foo = new WeakMap();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.weak-map']);
  expect(getBuiltinsForCode('var foo = new WeakSet();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.weak-set']);
  expect(getBuiltinsForCode('var foo = new Promise();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.promise']);
  expect(getBuiltinsForCode('var foo = new Symbol();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.symbol']);
});

test('test ES5 global', () => {
  expect(getBuiltinsForCode('var foo = new Foo();')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('test global property access', () => {
  expect(getBuiltinsForCode('Map.foo;')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.map']);
});

test('test global method call', () => {
  expect(getBuiltinsForCode('regeneratorRuntime.mark();')).toEqual(['core-js/modules/es6.array.iterator','regenerator-runtime/runtime']);
});

test('function parameter shadows global object', () => {
  expect(getBuiltinsForCode('function foo(Map) { var a = new Map(); }')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('function parameter shadows global static method', () => {
  expect(getBuiltinsForCode('function foo(Array) { var a = Array.of([1,2,3]); }')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('function variable shadows global object', () => {
  expect(getBuiltinsForCode('function foo() { var Map = {}; var a = new Map(); }')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('function variable shadows global static method', () => {
  expect(getBuiltinsForCode('function foo() { var Array = {}; var a = Array.of([1,2,3]); }')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('function name shadows global object', () => {
  expect(getBuiltinsForCode('function Map() { var a = Map(); }')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('function name shadows global static methods', () => {
  expect(getBuiltinsForCode('function Array() { var a = Array.of([1,2,3]); }'))
    .toEqual(['core-js/modules/es6.array.iterator']);
});

test('function scope does not interfere with global scope', () => {
  expect(getBuiltinsForCode('var b = new Map(); function foo() { var Map = {}; var a = new Map(); }'))
    .toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.map']);
});

test('function scope does not interfere with global static methods', () => {
  expect(getBuiltinsForCode('var b = Array.of([1,2,3]); function foo() { var Array = {}; var a = Array.of([1,2,3]); }'))
    .toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.array.of']);
});

test('variable shadows global object', () => {
  expect(getBuiltinsForCode('var Map = {}; var a = new Map();')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('variable shadows static method', () => {
  expect(getBuiltinsForCode('var Array = {}; var a = Array.of([1,2,3]);')).toEqual(['core-js/modules/es6.array.iterator']);
});

test('instance method', () => {
  expect(getBuiltinsForCode('foo.codePointAt;')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.string.code-point-at']);
  expect(getBuiltinsForCode('foo.codePointAt();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.string.code-point-at']);
})

test('instance method 2', () => {
  expect(getBuiltinsForCode('foo.includes;')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.string.includes','core-js/modules/es7.array.includes']);
})

test('computed instance method', () => {
  expect(getBuiltinsForCode('foo["codePointAt"]();')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.string.code-point-at']);
})

test('instance method in a function', () => {
  expect(getBuiltinsForCode('function bar() { foo.codePointAt(); }')).toEqual(['core-js/modules/es6.array.iterator','core-js/modules/es6.string.code-point-at']);
})
