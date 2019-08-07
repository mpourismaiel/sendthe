import { Dictionary } from './types';

const createKey = (prefix, keys, parent) =>
  prefix + keys.map(key => `${key}=${parent[key]}`).join('&');

const SendThe = (API = {}) => {
  const dictionary: Dictionary<string[]> = {};

  const memoizedParams = {};
  const memoizedQueries = {};
  const getMemoized = (memory, prefix, url, obj) => {
    const keys = Object.keys(obj || {});
    if (
      typeof obj === 'undefined' ||
      obj === null ||
      Object.keys(obj).filter(key => typeof obj[key] !== 'undefined').length ===
        0
    ) {
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
    } else if (memoized.noObject) {
      return memoized.url;
    }

    let tmp = url;
    memoized.keys.forEach(
      key => (tmp = tmp.replace(new RegExp(`:${key}`, 'ig'), params[key])),
    );

    memoizedParams[memoized.memoizedKey] = tmp;
    return tmp;
  };

  const addQuery = (url, query) => {
    const memoized = getMemoized(memoizedQueries, '', url, query);
    if (typeof memoized === 'string') {
      return `${url}?${memoized}`;
    } else if (memoized.noObject) {
      return memoized.url;
    }

    let tmp = memoized.memoizedKey;
    if (tmp.length > 0) {
      memoizedQueries[memoized.memoizedKey] = tmp;
    }

    return `${url}?${tmp}`;
  };

  const get = (name, params?, query?) => {
    const names = Array.isArray(name) ? name : [name];
    const endpoints = Object.keys(dictionary).filter(endpoint =>
      names.some(name => dictionary[endpoint].indexOf(name) > -1),
    );

    if (endpoints.length === 0) {
      return null;
    }

    return endpoints.map(endpoint =>
      addQuery(replaceParams(endpoint, params), query),
    );
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

export default SendThe;
