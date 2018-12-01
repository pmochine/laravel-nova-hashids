/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(6);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

Nova.booting(function (Vue, router) {
    Vue.component('laravel-nova-hashids', __webpack_require__(2));
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = __webpack_require__(4)
/* template */
var __vue_template__ = __webpack_require__(5)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Card.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b9bc2c0a", Component.options)
  } else {
    hotAPI.reload("data-v-b9bc2c0a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__IdHeader__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__IdHeader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__IdHeader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IdConverter__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IdConverter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__IdConverter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__IdEmpty__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__IdEmpty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__IdEmpty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__IdError__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__IdError___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__IdError__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            error: false,
            empty: false,
            loading: true,
            selection: [],
            selected: '',
            ids: {
                hashId: '',
                modelId: ''
            }

        };
    },

    components: {
        IdHeader: __WEBPACK_IMPORTED_MODULE_0__IdHeader___default.a,
        IdConverter: __WEBPACK_IMPORTED_MODULE_1__IdConverter___default.a,
        IdEmpty: __WEBPACK_IMPORTED_MODULE_2__IdEmpty___default.a,
        IdError: __WEBPACK_IMPORTED_MODULE_3__IdError___default.a
    },
    computed: {
        url: function url() {
            return '/nova-vendor/laravel-nova-hashids/hashids';
        },
        showConverter: function showConverter() {
            return this.selection.length > 0 && !this.error && !this.empty;
        }
    },
    methods: {
        config: function config() {
            Nova.request().get(this.url).then(this.setConfig).catch(this.setError).finally(this.setLoading);
        },
        setConfig: function setConfig(_ref) {
            var data = _ref.data;

            if (data.status == 'empty') {
                return this.empty = true;
            }
            this.selected = data.default;
            this.selection = data.selection;
        },
        setLoading: function setLoading() {
            var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.loading = bool;
        },
        setError: function setError() {
            this.error = true;
        },
        handleSelected: function handleSelected(selected) {
            this.selected = selected;
            this.convert();
        },
        convert: function convert() {
            this.setLoading(true);

            Nova.request().post(this.url, _extends({}, this.ids, {
                'selected': this.selected
            })).then(this.showConvertedId).catch(this.setError).finally(this.setLoading);
        },
        showConvertedId: function showConvertedId(_ref2) {
            var data = _ref2.data;

            if (data.status == 'empty') {
                return;
            }
            this.ids[data.status] = data.value;
        }
    },

    mounted: function mounted() {
        this.config();
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "loading-card",
    {
      staticClass: "metric px-6 py-4 relative",
      attrs: { loading: _vm.loading }
    },
    [
      _c("id-header", {
        attrs: {
          "show-selection": _vm.showConverter,
          selection: _vm.selection
        },
        on: { selected: _vm.handleSelected }
      }),
      _vm._v(" "),
      _vm.showConverter
        ? _c("id-converter", {
            attrs: { ids: _vm.ids },
            on: {
              update: function($event) {
                _vm.ids = $event
              },
              convert: _vm.convert
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.empty ? _c("id-empty") : _vm._e(),
      _vm._v(" "),
      _vm.error ? _c("id-error") : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-b9bc2c0a", module.exports)
  }
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = __webpack_require__(12)
/* template */
var __vue_template__ = __webpack_require__(13)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/IdConverter.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79e589ac", Component.options)
  } else {
    hotAPI.reload("data-v-79e589ac", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		ids: { type: Object, required: true }
	},
	methods: {
		emitUpdate: function emitUpdate(hashId, modelId) {
			this.$emit('update', {
				hashId: hashId,
				modelId: modelId
			});
		}
	}
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "flex mb-3" }, [
      _c("div", { staticClass: "w-3/7" }, [
        _c("input", {
          staticClass: "w-full form-control form-input form-input-bordered",
          attrs: {
            id: "hashid",
            dusk: "hashid",
            type: "text",
            placeholder: "Hashid"
          },
          domProps: { value: _vm.ids.hashId },
          on: {
            input: function($event) {
              _vm.emitUpdate($event.target.value, "")
            }
          }
        })
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "w-1/7 flex items-center" }, [
        _c(
          "svg",
          {
            staticClass: "mx-2",
            attrs: {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: "20",
              height: "20"
            }
          },
          [
            _c("path", {
              staticClass: "heroicon-ui",
              attrs: {
                fill: "var(--sidebar-icon)",
                d:
                  "M5.41 16H18a2 2 0 0 0 2-2 1 1 0 0 1 2 0 4 4 0 0 1-4 4H5.41l2.3 2.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.4L5.4 16zM6 8a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4h12.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4L18.6 8H6z"
              }
            })
          ]
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "w-3/7" }, [
        _c("input", {
          staticClass: "w-full form-control form-input form-input-bordered",
          attrs: {
            id: "normalid",
            dusk: "normalid",
            type: "number",
            placeholder: "Model Id"
          },
          domProps: { value: _vm.ids.modelId },
          on: {
            input: function($event) {
              _vm.emitUpdate("", $event.target.value)
            }
          }
        })
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "flex" }, [
      _c(
        "button",
        {
          staticClass: "btn btn-default bg-40 text-80 hover:bg-50 ml-auto",
          attrs: { type: "button", dusk: "convert-button" },
          on: {
            click: function($event) {
              _vm.$emit("convert")
            }
          }
        },
        [_vm._v("\n\t        Convert\n\t    ")]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-79e589ac", module.exports)
  }
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = __webpack_require__(15)
/* template */
var __vue_template__ = __webpack_require__(16)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/IdHeader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-58126cf3", Component.options)
  } else {
    hotAPI.reload("data-v-58126cf3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		showSelection: { type: Boolean, required: true },
		selection: { type: Array, required: true }
	},
	methods: {
		jsUcfirst: function jsUcfirst(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}

});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "flex mb-3" }, [
    _c("h3", { staticClass: "mr-3 text-base text-80 font-bold" }, [
      _vm._v("Hashids Converter")
    ]),
    _vm._v(" "),
    _vm.showSelection
      ? _c(
          "select",
          {
            staticClass: "ml-auto min-w-24 h-6 text-xs no-appearance bg-40",
            on: {
              change: function($event) {
                _vm.$emit("selected", $event.target.value)
              }
            }
          },
          _vm._l(_vm.selection, function(option, index) {
            return _c("option", {
              key: index,
              domProps: {
                value: option,
                textContent: _vm._s(_vm.jsUcfirst(option))
              }
            })
          })
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-58126cf3", module.exports)
  }
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(18)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/IdEmpty.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-78c9e157", Component.options)
  } else {
    hotAPI.reload("data-v-78c9e157", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "flex flex-col pt-3 justify-center" }, [
      _c(
        "h1",
        { staticClass: "text-center text-3xl text-80 font-light mb-2" },
        [_vm._v("\n\t\tConfig Empty\n\t")]
      ),
      _vm._v(" "),
      _c("p", { staticClass: "text-70 font-light text-center" }, [
        _vm._v("\n\t\tPlease create the correct "),
        _c(
          "a",
          {
            staticClass: "text-primary dim no-underline",
            attrs: {
              href: "https://github.com/vinkla/laravel-hashids#configuration"
            }
          },
          [_vm._v("hashids config")]
        ),
        _vm._v(".\n\t")
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-78c9e157", module.exports)
  }
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(20)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/IdError.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3ddd4edc", Component.options)
  } else {
    hotAPI.reload("data-v-3ddd4edc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "flex flex-col pt-3 justify-center" }, [
      _c(
        "h1",
        { staticClass: "text-center text-3xl text-80 font-light mb-2" },
        [_vm._v("\n\t\tOoops Error\n\t")]
      ),
      _vm._v(" "),
      _c("p", { staticClass: "text-70 font-light text-center" }, [
        _vm._v("\n\t\tYour API failed. Please have a look.\n\t")
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3ddd4edc", module.exports)
  }
}

/***/ })
/******/ ]);