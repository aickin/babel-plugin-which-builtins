const alwaysInclude = [
  'core-js/modules/es6.array.iterator',
];

const instanceMethods = {
  name: ['core-js/modules/es6.function.name'],
  fromCodePoint: ['core-js/modules/es6.string.from-code-point'],
  codePointAt: ['core-js/modules/es6.string.code-point-at'],
  repeat: ['core-js/modules/es6.string.repeat'],
  startsWith: ['core-js/modules/es6.string.starts-with'],
  endsWith: ['core-js/modules/es6.string.ends-with'],
  includes: ['core-js/modules/es6.string.includes', 'core-js/modules/es7.array.includes'],
  flags: ['core-js/modules/es6.regexp.flags'],
  match: ['core-js/modules/es6.regexp.match'],
  replace: ['core-js/modules/es6.regexp.replace'],
  split: ['core-js/modules/es6.regexp.split'],
  search: ['core-js/modules/es6.regexp.search'],
  copyWithin: ['core-js/modules/es6.array.copy-within'],
  find: ['core-js/modules/es6.array.find'],
  findIndex: ['core-js/modules/es6.array.find-index'],
  fill: ['core-js/modules/es6.array.fill'],
  padStart: ['core-js/modules/es7.string.pad-start'],
  padEnd: ['core-js/modules/es7.string.pad-end'],
};

const staticMethods = {
  Reflect: {
    apply: 'core-js/modules/es6.reflect.apply',
    construct: 'core-js/modules/es6.reflect.construct',
    defineProperty: 'core-js/modules/es6.reflect.define-property',
    deleteProperty: 'core-js/modules/es6.reflect.delete-property',
    get: 'core-js/modules/es6.reflect.get',
    getOwnPropertyDescriptor: 'core-js/modules/es6.reflect.get-own-property-descriptor',
    getPrototypeOf: 'core-js/modules/es6.reflect.get-prototype-of',
    has: 'core-js/modules/es6.reflect.has',
    isExtensible: 'core-js/modules/es6.reflect.is-extensible',
    ownKeys: 'core-js/modules/es6.reflect.own-keys',
    preventExtensions: 'core-js/modules/es6.reflect.prevent-extensions',
    set: 'core-js/modules/es6.reflect.set',
    setPrototypeOf: 'core-js/modules/es6.reflect.set-prototype-of',
  },
  Object: {
    assign: 'core-js/modules/es6.object.assign',
    is: 'core-js/modules/es6.object.is',
    getOwnPropertySymbols: 'core-js/modules/es6.object.get-own-property-symbols',
    setPrototypeOf: 'core-js/modules/es6.object.set-prototype-of',
    values: 'core-js/modules/es7.object.values',
    entries: 'core-js/modules/es7.object.entries',
    getOwnPropertyDescriptors: 'core-js/modules/es7.object.get-own-property-descriptors',
  },
  String: {
    raw: 'core-js/modules/es6.string.raw',
  },
  Array: {
    from: 'core-js/modules/es6.array.from',
    of: 'core-js/modules/es6.array.of',
  },
  Number: {
    isFinite: 'core-js/modules/es6.number.is-finite',
    isInteger: 'core-js/modules/es6.number.is-integer',
    isSafeInteger: 'core-js/modules/es6.number.is-safe-integer',
    isNaN: 'core-js/modules/es6.number.is-nan',
    EPSILON: 'core-js/modules/es6.number.epsilon',
    MIN_SAFE_INTEGER: 'core-js/modules/es6.number.min-safe-integer',
    MAX_SAFE_INTEGER: 'core-js/modules/es6.number.max-safe-integer',
  },
  Math: {
    acosh: 'core-js/modules/es6.math.acosh',
    asinh: 'core-js/modules/es6.math.asinh',
    atanh: 'core-js/modules/es6.math.atanh',
    cbrt: 'core-js/modules/es6.math.cbrt',
    clz32: 'core-js/modules/es6.math.clz32',
    cosh: 'core-js/modules/es6.math.cosh',
    expm1: 'core-js/modules/es6.math.expm1',
    fround: 'core-js/modules/es6.math.fround',
    hypot: 'core-js/modules/es6.math.hypot',
    imul: 'core-js/modules/es6.math.imul',
    log1p: 'core-js/modules/es6.math.log1p',
    log10: 'core-js/modules/es6.math.log10',
    log2: 'core-js/modules/es6.math.log2',
    sign: 'core-js/modules/es6.math.sign',
    sinh: 'core-js/modules/es6.math.sinh',
    tanh: 'core-js/modules/es6.math.tanh',
    trunc: 'core-js/modules/es6.math.trunc',
  },
};

const globals = {
  regeneratorRuntime: 'regenerator-runtime/runtime',
  DataView: 'core-js/modules/es6.typed.data-view',
  Int8Array: 'core-js/modules/es6.typed.int8-array',
  Uint8Array: 'core-js/modules/es6.typed.uint8-array',
  Uint8ClampedArray: 'core-js/modules/es6.typed.uint8-clamped-array',
  Int16Array: 'core-js/modules/es6.typed.int16-array',
  Uint16Array: 'core-js/modules/es6.typed.uint16-array',
  Int32Array: 'core-js/modules/es6.typed.int32-array',
  Uint32Array: 'core-js/modules/es6.typed.uint32-array',
  Float32Array: 'core-js/modules/es6.typed.float32-array',
  Float64Array: 'core-js/modules/es6.typed.float64-array',
  Map: 'core-js/modules/es6.map',
  Set: 'core-js/modules/es6.set',
  WeakMap: 'core-js/modules/es6.weak-map',
  WeakSet: 'core-js/modules/es6.weak-set',
  Promise: 'core-js/modules/es6.promise',
  Symbol: 'core-js/modules/es6.symbol',
};

function isFromInherentScope(name, scope) {
  let currentScope = scope;

  // make sure there is no *own* binding in any scope, including the global scope.
  while (currentScope) {
    if (currentScope.hasOwnBinding(name)) {
      return false;
    }
    if (currentScope.parent) {
      currentScope = currentScope.parent;
    } else {
      break;
    }
  }

  // now currentScope should be the global scope.
  return currentScope.hasBinding(name);
}

function whichBuiltinsPlugin({ types: t }) {
  let builtins = {};
  return {
    visitor: {
      Program: {
        enter(path) {
          builtins = {};
          alwaysInclude.forEach((module) => {
            builtins[module] = true;
          });
          for (const objName of Object.keys(globals)) {
            if (path.scope.globals[objName]) {
              // this is an ES2015/2016/2017 global that is being used in the code.
              builtins[globals[objName]] = true;
            }
          }
        },

        exit(path) {
          Object.keys(builtins).sort().forEach((builtin) => {
            // add an import declaration for each builtin the code uses.
            path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral(builtin)));
          });
        },
      },

      MemberExpression(path) {
        const object = path.node.object;

        let propertyName = null;
        if (!path.node.computed && t.isIdentifier(path.node.property)) {
          propertyName = path.node.property.name;
        }
        if (path.node.computed && t.isStringLiteral(path.node.property)) {
          propertyName = path.node.property.value;
        }

        // if we can't identify the property name, there's no point in continuing.
        if (!propertyName) {
          return;
        }

        if (t.isIdentifier(object)
            && staticMethods[object.name]
            && staticMethods[object.name][propertyName]
            && (
              !path.scope.hasBinding(object.name) || isFromInherentScope(object.name, path.scope)
            )) {
          // this is an ES2015/2016/2017 static method that is being used in the code.
          builtins[staticMethods[object.name][propertyName]] = true;
          return;
        }

        if (instanceMethods[propertyName]) {
          // this is **potentially** a use of an ES2015/2016/2017/2017 instance method.
          // include that instance method's polyfill in case.
          instanceMethods[propertyName].forEach((module) => {
            builtins[module] = true;
          });
        }
      },
    },
  };
}

module.exports = whichBuiltinsPlugin;
