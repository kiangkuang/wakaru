import { defineInlineTest } from '@wakaru/test-utils'
import transform from '../un-nullish-coalescing'

const inlineTest = defineInlineTest(transform)

inlineTest('Babel',
  `
foo !== null && foo !== void 0 ? foo : "bar";

var _ref;
(_ref = foo !== null && foo !== void 0 ? foo : bar) !== null && _ref !== void 0 ? _ref : "quz";

// transform-in-default-destructuring
var _foo$bar;
var { qux = (_foo$bar = foo.bar) !== null && _foo$bar !== void 0 ? _foo$bar : "qux" } = {};

// transform-in-default-param
function foo(foo, qux = (_foo$bar => (_foo$bar = foo.bar) !== null && _foo$bar !== void 0 ? _foo$bar : "qux")()) {}
function bar(bar, qux = bar !== null && bar !== void 0 ? bar : "qux") {}

// transform-in-function
function foo2(opts) {
  var _opts$foo;
  var foo = (_opts$foo = opts.foo) !== null && _opts$foo !== void 0 ? _opts$foo : "default";
}

// transform-static-refs-in-default
function foo3(foo, bar = foo !== null && foo !== void 0 ? foo : "bar") {}

// transform-static-refs-in-function
function foo4() {
  var foo = this !== null && this !== void 0 ? this : {};
}
`,
  `
foo ?? "bar";

foo ?? bar ?? "quz";

// transform-in-default-destructuring
var { qux = foo.bar ?? "qux" } = {};

// transform-in-default-param
function foo(foo, qux = (_foo$bar => foo.bar ?? "qux")()) {}
function bar(bar, qux = bar ?? "qux") {}

// transform-in-function
function foo2(opts) {
  var foo = opts.foo ?? "default";
}

// transform-static-refs-in-default
function foo3(foo, bar = foo ?? "bar") {}

// transform-static-refs-in-function
function foo4() {
  var foo = this ?? {};
}
`,
)

inlineTest('SWC - ES6',
  `
foo !== null && foo !== void 0 ? foo : "bar";

var _ref;
(_ref = foo !== null && foo !== void 0 ? foo : bar) !== null && _ref !== void 0 ? _ref : "quz";

// transform-in-function
function foo2(opts) {
  var _opts_foo;
  var _$foo = (_opts_foo = opts.foo) !== null && _opts_foo !== void 0 ? _opts_foo : "default";
}

// transform-in-default-destructuring
var _foo_bar;
var { qux = (_foo_bar = foo.bar) !== null && _foo_bar !== void 0 ? _foo_bar : "qux" } = {};

// transform-in-default-param
var _foo_bar1;
function foo(foo, qux = (_foo_bar1 = foo.bar) !== null && _foo_bar1 !== void 0 ? _foo_bar1 : "qux") {}
function bar(bar, qux = bar !== null && bar !== void 0 ? bar : "qux") {}

// transform-static-refs-in-default
function foo3(foo, bar = foo !== null && foo !== void 0 ? foo : "bar") {}

// transform-static-refs-in-function
function foo4() {
  var _this;
  var _$foo = (_this = this) !== null && _this !== void 0 ? _this : {};
}
`,
  `
foo ?? "bar";

foo ?? bar ?? "quz";

// transform-in-function
function foo2(opts) {
  var _$foo = opts.foo ?? "default";
}

// transform-in-default-destructuring
var { qux = foo.bar ?? "qux" } = {};

// transform-in-default-param
var _foo_bar1;
function foo(foo, qux = foo.bar ?? "qux") {}
function bar(bar, qux = bar ?? "qux") {}

// transform-static-refs-in-default
function foo3(foo, bar = foo ?? "bar") {}

// transform-static-refs-in-function
function foo4() {
  var _$foo = this ?? {};
}
`,
)

// FIXME: ES5 default parameter will be transformed
// to a form that we don't support yet.
inlineTest.skip('SWC - ES5',
  `
foo !== null && foo !== void 0 ? foo : "bar";

var _ref;
(_ref = foo !== null && foo !== void 0 ? foo : bar) !== null && _ref !== void 0 ? _ref : "quz";

// transform-in-function
function foo2(opts) {
    var _opts_foo;
    var _$foo = (_opts_foo = opts.foo) !== null && _opts_foo !== void 0 ? _opts_foo : "default";
}

// transform-in-default-destructuring
var _foo_bar;
var _ref1 = {}, _ref_qux = _ref1.qux, qux = _ref_qux === void 0 ? (_foo_bar = foo.bar) !== null && _foo_bar !== void 0 ? _foo_bar : "qux" : _ref_qux;

// transform-in-default-param
var _foo_bar1;
function foo(foo) {
  var qux = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : (_foo_bar1 = foo.bar) !== null && _foo_bar1 !== void 0 ? _foo_bar1 : "qux";
}
function bar(bar) {
  var qux = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : bar !== null && bar !== void 0 ? bar : "qux";
}

// transform-static-refs-in-default
function foo3(foo) {
  var _$bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo !== null && foo !== void 0 ? foo : "bar";
}

// transform-static-refs-in-function
function foo4() {
  var _this;
  var _$foo = (_this = this) !== null && _this !== void 0 ? _this : {};
}
`,
  `
foo ?? "bar";

foo ?? bar ?? "quz";

// transform-in-function
function foo2(opts) {
  var _$foo = opts.foo ?? "default";
}

// transform-in-default-destructuring
var { qux = foo.bar ?? "qux" } = {};

// transform-in-default-param
function foo(foo, qux = foo.bar ?? "qux") {}
function bar(bar, qux = bar ?? "qux") {}

// transform-static-refs-in-default
function foo3(foo, bar = foo ?? "bar") {}
`,
)

inlineTest('TypeScript',
  `
var _a, _b;
foo !== null && foo !== void 0 ? foo : "bar";

(_a = foo !== null && foo !== void 0 ? foo : bar) !== null && _a !== void 0 ? _a : "quz";

// transform-in-default-param
function foo(foo, qux) { var _a; if (qux === void 0) { qux = (_a = foo.bar) !== null && _a !== void 0 ? _a : "qux"; } }
function bar(bar, qux = bar !== null && bar !== void 0 ? bar : "qux") {}

// transform-in-function
function foo2(opts) {
  var _a;
  var foo = (_a = opts.foo) !== null && _a !== void 0 ? _a : "default";
}

// transform-static-refs-in-default
function foo3(foo, bar = foo !== null && foo !== void 0 ? foo : "bar") {}

// transform-static-refs-in-function
function foo4() {
  var foo = this !== null && this !== void 0 ? this : {};
}
`,
  `
var _b;
foo ?? "bar";

foo ?? bar ?? "quz";

// transform-in-default-param
function foo(foo, qux) { var _a; if (qux === void 0) { qux = foo.bar ?? "qux"; } }
function bar(bar, qux = bar ?? "qux") {}

// transform-in-function
function foo2(opts) {
  var foo = opts.foo ?? "default";
}

// transform-static-refs-in-default
function foo3(foo, bar = foo ?? "bar") {}

// transform-static-refs-in-function
function foo4() {
  var foo = this ?? {};
}
`,
)

inlineTest.skip('TypeScript - Fail cases',
  `
// transform-in-default-destructuring
var _c = {}.qux, qux = _c === void 0 ? (_b = foo.bar) !== null && _b !== void 0 ? _b : "qux" : _c;

// transform-in-default-param
function foo(foo, qux) {
  var _a;
  if (qux === void 0) { qux = (_a = foo.bar) !== null && _a !== void 0 ? _a : "qux"; }
}
function bar(bar, qux) {
  if (qux === void 0) { qux = bar !== null && bar !== void 0 ? bar : "qux"; }
}

// transform-static-refs-in-default
function foo3(foo, bar) {
  if (bar === void 0) { bar = foo !== null && foo !== void 0 ? foo : "bar"; }
}
`,
  `
// transform-in-default-destructuring
var { qux = foo.bar ?? "qux" } = {};

// transform-in-default-param
function foo(foo, qux = foo.bar ?? "qux") {}
function bar(bar, qux = bar ?? "qux") {}

// transform-static-refs-in-default
function foo3(foo, bar = foo ?? "bar") {}
`,
)
