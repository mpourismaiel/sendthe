var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
define('types', ['require', 'exports'], function(require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
});
define('sendthe', ['require', 'exports'], function(require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  var dictionary = {};
  var createKey = function(keys, parent) {
    return keys
      .map(function(key) {
        return key + '=' + parent[key];
      })
      .join('&');
  };
  var memoizedParams = {};
  var getMemoized = function(url, obj) {
    var keys = Object.keys(obj || {});
    if (
      typeof obj === 'undefined' ||
      obj === null ||
      Object.keys(obj).filter(function(key) {
        return typeof obj[key] !== 'undefined';
      }).length === 0
    ) {
      return url;
    }
    var memoizedKey = createKey(keys, obj);
    if (memoizedParams[memoizedKey]) {
      return memoizedParams[memoizedKey];
    }
    return { keys: keys, memoizedKey: memoizedKey };
  };
  var replaceParams = function(url, params) {
    var memoized = getMemoized(url, params);
    if (typeof memoized !== 'object') {
      return memoized;
    }
    var tmp = url;
    memoized.keys.forEach(function(key) {
      return tmp.replace(new RegExp(':' + key, 'ig'), params[key]);
    });
    memoizedParams[memoized.memoizedKey] = tmp;
    return tmp;
  };
  var addQuery = function(url, query) {
    var memoized = getMemoized(url, query);
    if (typeof memoized !== 'object') {
      return memoized;
    }
    var tmp = '';
    memoized.keys.forEach(function(key) {
      return (tmp += key + '=' + query[key]);
    });
    if (tmp.length > 0) {
      tmp = '?' + tmp;
    }
    memoizedParams[memoized.memoizedKey] = tmp;
    return tmp;
  };
  var SendThe = function(name, params, query) {
    return addQuery(replaceParams(dictionary[name], params), query);
  };
  SendThe.add = function(name, endpoint) {
    dictionary[name] = endpoint;
  };
  exports.default = SendThe;
});
define('index.test', ['require', 'exports', 'ava', 'sendthe'], function(
  require,
  exports,
  ava_1,
  sendthe_1,
) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  ava_1 = __importDefault(ava_1);
  sendthe_1 = __importDefault(sendthe_1);
  ava_1.default('url is aquired', function(t) {
    var url = 'http://example.com';
    var name = 'example';
    sendthe_1.default.add(name, url);
    t.is(sendthe_1.default(name), url);
  });
  ava_1.default('url with params is properly aquired', function(t) {
    var url = 'http://example.com/:resource';
    var name = 'example';
    var params = { resource: 1 };
    var expected = 'http://example.com/' + params.resource;
    sendthe_1.default.add(name, url);
    t.is(sendthe_1.default(name, params), expected);
  });
  ava_1.default('url with query is properly aquired', function(t) {
    var url = 'http://example.com/';
    var name = 'example';
    var query = { resource: 1 };
    var expected = 'http://example.com/?resource=' + query.resource;
    sendthe_1.default.add(name, url);
    t.is(sendthe_1.default(name, null, query), expected);
  });
  ava_1.default('url with query is properly aquired', function(t) {
    var url = 'http://example.com/';
    var name = 'example';
    var query = { resource: 1 };
    var params = { resource: 1 };
    var expected =
      'http://example.com/' + params.resource + '/?resource=' + query.resource;
    sendthe_1.default.add(name, url);
    t.is(sendthe_1.default(name, params, query), expected);
  });
});
