var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("sendthe", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const createKey = (prefix, keys, parent) => prefix + keys.map(key => `${key}=${parent[key]}`).join('&');
    const SendThe = (API = {}) => {
        const dictionary = {};
        const memoizedParams = {};
        const memoizedQueries = {};
        const getMemoized = (memory, prefix, url, obj) => {
            const keys = Object.keys(obj || {});
            if (typeof obj === 'undefined' ||
                obj === null ||
                Object.keys(obj).filter(key => typeof obj[key] !== 'undefined').length ===
                    0) {
                return { url, noObject: true };
            }
            const memoizedKey = createKey(prefix, keys, obj);
            if (memory[memoizedKey]) {
                return memory[memoizedKey];
            }
            return { keys, memoizedKey };
        };
        const replaceParams = (url, params) => {
            const memoized = getMemoized(memoizedParams, url, url, params);
            if (typeof memoized === 'string') {
                return memoized;
            }
            else if (memoized.noObject) {
                return memoized.url;
            }
            let tmp = url;
            memoized.keys.forEach(key => (tmp = tmp.replace(new RegExp(`:${key}`, 'ig'), params[key])));
            memoizedParams[memoized.memoizedKey] = tmp;
            return tmp;
        };
        const addQuery = (url, query) => {
            const memoized = getMemoized(memoizedQueries, '', url, query);
            if (typeof memoized === 'string') {
                return `${url}?${memoized}`;
            }
            else if (memoized.noObject) {
                return memoized.url;
            }
            let tmp = memoized.memoizedKey;
            if (tmp.length > 0) {
                memoizedQueries[memoized.memoizedKey] = tmp;
            }
            return `${url}?${tmp}`;
        };
        const get = (name, params, query) => {
            const names = Array.isArray(name) ? name : [name];
            const endpoints = Object.keys(dictionary).filter(endpoint => names.some(name => dictionary[endpoint].indexOf(name) > -1));
            if (endpoints.length === 0) {
                return null;
            }
            return endpoints.map(endpoint => addQuery(replaceParams(endpoint, params), query));
        };
        const add = (name, endpoint) => {
            dictionary[endpoint] =
                typeof dictionary[endpoint] === 'undefined'
                    ? Array.isArray(name)
                        ? name
                        : [name]
                    : dictionary[endpoint].concat(name);
        };
        Object.keys(API).forEach(endpoint => add(API[endpoint], endpoint));
        return { get, add, cache: dictionary };
    };
    exports.default = SendThe;
});
define("index.test", ["require", "exports", "sendthe"], function (require, exports, sendthe_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    sendthe_1 = __importDefault(sendthe_1);
    it('url is aquired', () => {
        const url = 'http://example.com';
        const name = 'example';
        const sendThe = sendthe_1.default();
        sendThe.add(name, url);
        expect(sendThe.get(name)).toEqual([url]);
    });
    it('url with params is properly aquired', () => {
        const url = 'http://example.com/:resource';
        const name = 'example';
        const params = { resource: 1 };
        const expected = [`http://example.com/${params.resource}`];
        const sendThe = sendthe_1.default();
        sendThe.add(name, url);
        expect(sendThe.get(name, params)).toEqual(expected);
    });
    it('url with query is properly aquired', () => {
        const url = 'http://example.com/';
        const name = 'example';
        const query = { resource: 1 };
        const expected = [`http://example.com/?resource=${query.resource}`];
        const sendThe = sendthe_1.default();
        sendThe.add(name, url);
        expect(sendThe.get(name, null, query)).toEqual(expected);
    });
    it('url with query and params is properly aquired', () => {
        const url = 'http://example.com/:resource';
        const name = 'example';
        const query = { resource: 1 };
        const params = { resource: 1 };
        const expected = [
            `http://example.com/${params.resource}?resource=${query.resource}`,
        ];
        const sendThe = sendthe_1.default();
        sendThe.add(name, url);
        expect(sendThe.get(name, params, query)).toEqual(expected);
    });
    it('url with query and params is properly aquired when there are no params in url', () => {
        const url = 'http://example.com/';
        const name = 'example';
        const query = { resource: 1 };
        const params = { resource: 1 };
        const expected = [`http://example.com/?resource=${query.resource}`];
        const sendThe = sendthe_1.default();
        sendThe.add(name, url);
        expect(sendThe.get(name, params, query)).toEqual(expected);
    });
    it('should add urls by passing an argument to the factory', () => {
        const url = 'http://example.com/';
        const name = 'example';
        const sendThe = sendthe_1.default({ [url]: name });
        expect(sendThe.get(name)).toEqual([url]);
    });
    it('should add urls with multiple names using factory', () => {
        const url = 'http://example.com/';
        const name1 = 'example';
        const name2 = 'example-2';
        const sendThe = sendthe_1.default({ [url]: [name1, name2] });
        expect(sendThe.get(name1)).toEqual([url]);
    });
    it('should add urls with multiple names using add function', () => {
        const url = 'http://example.com/';
        const name1 = 'example';
        const name2 = 'example-2';
        const sendThe = sendthe_1.default();
        sendThe.add([name1, name2], url);
        expect(sendThe.get(name1)).toEqual([url]);
    });
    it('should append resource to previously added endpoint when endpoint exists', () => {
        const url = 'http://example.com/';
        const name1 = 'example';
        const name2 = 'example-2';
        const sendThe = sendthe_1.default();
        sendThe.add(name1, url);
        sendThe.add(name2, url);
        expect(sendThe.get(name1)).toEqual([url]);
        expect(sendThe.get(name2)).toEqual([url]);
    });
    it('should receive a url representing multiple resources', () => {
        const url = 'http://example.com/';
        const name1 = 'example';
        const name2 = 'example-2';
        const sendThe = sendthe_1.default({ [url]: [name1, name2] });
        expect(sendThe.get(name1)).toEqual([url]);
        expect(sendThe.get(name2)).toEqual([url]);
    });
    it('should return null when endpoint is not added', () => {
        const name = 'example';
        const sendThe = sendthe_1.default();
        expect(sendThe.get(name)).toEqual(null);
    });
    it('should return same result when get is ran multiple times', () => {
        const url = 'http://example.com/';
        const name = 'example';
        const query = { resource: 1 };
        const params = { resource: 1 };
        const expected = [`http://example.com/?resource=${query.resource}`];
        const sendThe = sendthe_1.default();
        sendThe.add(name, url);
        expect(sendThe.get(name, params, query)).toEqual(expected);
        expect(sendThe.get(name, params, query)).toEqual(expected);
    });
    it('should return all the endpoints that return the same resource', () => {
        const url1 = 'http://example.com/';
        const url2 = 'http://example2.com/';
        const name = 'example';
        const sendThe = sendthe_1.default({ [url1]: name, [url2]: name });
        expect(sendThe.get(name)).toEqual([url1, url2]);
    });
    it('should return all the endpoints that match all the resources', () => {
        const url1 = 'http://example.com/';
        const url2 = 'http://example2.com/';
        const name1 = 'example';
        const name2 = 'example-2';
        const sendThe = sendthe_1.default({ [url1]: name1, [url2]: name2 });
        expect(sendThe.get([name1, name2])).toEqual([url1, url2]);
    });
    it('should keep the cache', () => {
        const url1 = 'http://example.com/';
        const url2 = 'http://example2.com/';
        const name1 = 'example';
        const name2 = 'example-2';
        const sendThe = sendthe_1.default({ [url1]: name1, [url2]: name2 });
        expect(sendThe.cache).toEqual({ [url1]: [name1], [url2]: [name2] });
    });
});
define("index", ["require", "exports", "sendthe"], function (require, exports, sendthe_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SendThe = sendthe_2.default;
});
