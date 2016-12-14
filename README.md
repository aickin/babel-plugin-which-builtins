#babel-plugin-which-builtins

This is a Babel plugin which attempts to determine which ECMAScript 2015/2016/2017
library built-ins are used by a codebase and only import polyfills for just the
built-ins which are actually used. It is a replacement for importing the
entirety of `babel-polyfill`.

##Instructions

First install the plugin to your project, along with `core-js` and `regenerator-runtime`:

```
npm install --save-dev babel-plugin-which-builtins core-js regenerator-runtime
```

Next add it to your Babel configuration **after** all the plugins that transform your
code. For example, in a `.babelrc` file:

```json
{
  "plugins": { "which-builtins" }
}
```

##What does it do?

When this plugin encounters code that seems to use new built-in JavaScript global
objects, static methods, or instance methods, it adds an `import` declaration
for a polyfill that will add that built-in. For example, with this input:

```
const foo = Array.from([1,2,3]);
```

the plugin will produce this output:

```
import "core-js/modules/es6.array.from"
import "core-js/modules/es6.array.iterator"
const foo = Array.from([1,2,3]);
```

Note that this transformer does not insert the polyfill itself; it just adds an
import statement for the polyfill. If you want to run this code in a browser, you
will need to run it through a bundler like webpack, browserify, or rollup.

In additon to the ECMAScript polyfills of `core-js`, the plugin also looks for
and polyfills references to `regeneratorRuntime`, which are created by the standard
Babel plugin for transforming generators.

##When does the plugin fail?

Unfortunately, in a completely dynamic language like JavaScript, static analysis
can only go so far, and as a result `babel-plugin-which-builtins` cannot catch
every usage of new built-ins. There are two main known cases where the plugin
will fail.

The first case in which the plugin will fail is when code refers to one of the
built-in globals that has new methods (like `Math` or `Array`) using dynamic code
to refer to the global object. As an example:

```
// this case will work.
var a = Math.cos(90);
var { cos } = Math;

// this case will not work because Math doesn't have a direct
// property access in the code.
function getMath() { return Math; }
var b = getMath().cos(90);
var { cos } = getMath();
```

The second case in which the plugin will fail is when code refers to a new built-in
static or instance method in a dynamic way. For example:

```
// these cases will work.
var a = "foo".startsWith("f");
var b = "foo"["startsWith"]("f");
var { startsWith } = "foo";
var c = Math.cos(90);
var d = Math["cos"](90);
var { cos } = Math;

// these cases will not work.
var e = "foo"["starts" + "With"]("f");
var { ["starts" + "With"]: f } = "foo";
var g = "startsWith".forEach(method => "foo"[method]("f"))[0];
var h = Math["c" + "os"](90);
var { ["c" + "os"]: i } = Math;
function getCos() {
  return "cos";
}
var j = Math[getCos()](90);
var { [getCos()]: k } = Math;
```

##Instance methods may produce false positives

Some of the new built-ins in ES2015/2016/2017 are instance methods, like
`Array.prototype.find` or `String.prototype.startsWith`. It's very difficult
(bordering on impossible) to statically figure out the type of a variable
in JavaScript, so this plugin is conservative and assumes that any reference to
a property with the same name of a new instance method is a reference to that
instance method. For example:

```
// this triggers an import of String.prototype.startsWith.
var a = "foo".startsWith("f");
var { startsWith } = "foo";

// this also triggers an import of String.prototype.startsWith (false positive).
var b = null;
var c = b.startsWith("f");
var { startsWith } = b;

// this also triggers an import of String.prototype.startsWith (false positive).
var e = b["startsWith"];
```

The theory here is that including an instance method polyfill when it's not
needed is better than not including it when it is needed.

#What features are polyfilled?
* Generators
 * `regeneratorRuntime`
* Global objects
 * `DataView`
 * `Int8Array`
 * `Uint8Array`
 * `Uint8ClampedArray`
 * `Int16Array`
 * `Uint16Array`
 * `Int32Array`
 * `Uint32Array`
 * `Float32Array`
 * `Float64Array`
 * `Map`
 * `Set`
 * `WeakMap`
 * `WeakSet`
 * `Promise`
 * `Symbol`
 * `Reflect`
* Static methods
 * `Array.from`
 * `Array.of`
 * `Math.acosh`
 * `Math.asinh`
 * `Math.atanh`
 * `Math.cbrt`
 * `Math.clz32`
 * `Math.cosh`
 * `Math.expm1`
 * `Math.fround`
 * `Math.hypot`
 * `Math.imul`
 * `Math.log1p`
 * `Math.log10`
 * `Math.log2`
 * `Math.sign`
 * `Math.sinh`
 * `Math.tanh`
 * `Math.trunc`
 * `Number.isFinite`
 * `Number.isInteger`
 * `Number.isSafeInteger`
 * `Number.isNaN`
 * `Number.EPSILON`
 * `Number.MIN_SAFE_INTEGER`
 * `Number.MAX_SAFE_INTEGER`
 * `Object.assign`
 * `Object.is`
 * `Object.getOwnPropertySymbols`
 * `Object.setPrototypeOf`
 * `Object.values`
 * `Object.entries`
 * `Object.getOwnPropertyDescriptors`
 * `String.raw`
* Instance methods
 * `Array.prototype.copyWithin`
 * `Array.prototype.find`
 * `Array.prototype.findIndex`
 * `Array.prototype.fill`
 * `Array.prototype.includes`
 * `Function.prototype.name`
 * `RegExp.prototype.flags`
 * `RegExp.prototype.match`
 * `RegExp.prototype.replace`
 * `RegExp.prototype.split`
 * `RegExp.prototype.search`
 * `String.prototype.codePointAt`
 * `String.prototype.fromCodePoint`
 * `String.prototype.padStart`
 * `String.prototype.padEnd`
 * `String.prototype.repeat`
 * `String.prototype.startsWith`
 * `String.prototype.endsWith`
 * `String.prototype.includes`
