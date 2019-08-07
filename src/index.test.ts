import SendThe from './sendthe';

it('url is aquired', () => {
  const url = 'http://example.com';
  const name = 'example';

  const sendThe = SendThe();
  sendThe.add(name, url);
  expect(sendThe.get(name)).toEqual([url]);
});

it('url with params is properly aquired', () => {
  const url = 'http://example.com/:resource';
  const name = 'example';
  const params = { resource: 1 };
  const expected = [`http://example.com/${params.resource}`];

  const sendThe = SendThe();
  sendThe.add(name, url);
  expect(sendThe.get(name, params)).toEqual(expected);
});

it('url with query is properly aquired', () => {
  const url = 'http://example.com/';
  const name = 'example';
  const query = { resource: 1 };
  const expected = [`http://example.com/?resource=${query.resource}`];

  const sendThe = SendThe();
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

  const sendThe = SendThe();
  sendThe.add(name, url);
  expect(sendThe.get(name, params, query)).toEqual(expected);
});

it('url with query and params is properly aquired when there are no params in url', () => {
  const url = 'http://example.com/';
  const name = 'example';
  const query = { resource: 1 };
  const params = { resource: 1 };
  const expected = [`http://example.com/?resource=${query.resource}`];

  const sendThe = SendThe();
  sendThe.add(name, url);
  expect(sendThe.get(name, params, query)).toEqual(expected);
});

it('should add urls by passing an argument to the factory', () => {
  const url = 'http://example.com/';
  const name = 'example';

  const sendThe = SendThe({ [url]: name });
  expect(sendThe.get(name)).toEqual([url]);
});

it('should add urls with multiple names using factory', () => {
  const url = 'http://example.com/';
  const name1 = 'example';
  const name2 = 'example-2';

  const sendThe = SendThe({ [url]: [name1, name2] });
  expect(sendThe.get(name1)).toEqual([url]);
});

it('should add urls with multiple names using add function', () => {
  const url = 'http://example.com/';
  const name1 = 'example';
  const name2 = 'example-2';

  const sendThe = SendThe();
  sendThe.add([name1, name2], url);
  expect(sendThe.get(name1)).toEqual([url]);
});

it('should append resource to previously added endpoint when endpoint exists', () => {
  const url = 'http://example.com/';
  const name1 = 'example';
  const name2 = 'example-2';

  const sendThe = SendThe();
  sendThe.add(name1, url);
  sendThe.add(name2, url);
  expect(sendThe.get(name1)).toEqual([url]);
  expect(sendThe.get(name2)).toEqual([url]);
});

it('should receive a url representing multiple resources', () => {
  const url = 'http://example.com/';
  const name1 = 'example';
  const name2 = 'example-2';

  const sendThe = SendThe({ [url]: [name1, name2] });
  expect(sendThe.get(name1)).toEqual([url]);
  expect(sendThe.get(name2)).toEqual([url]);
});

it('should return null when endpoint is not added', () => {
  const name = 'example';
  const sendThe = SendThe();
  expect(sendThe.get(name)).toEqual(null);
});

it('should return same result when get is ran multiple times', () => {
  const url = 'http://example.com/';
  const name = 'example';
  const query = { resource: 1 };
  const params = { resource: 1 };
  const expected = [`http://example.com/?resource=${query.resource}`];

  const sendThe = SendThe();
  sendThe.add(name, url);
  expect(sendThe.get(name, params, query)).toEqual(expected);
  expect(sendThe.get(name, params, query)).toEqual(expected);
});

it('should return all the endpoints that return the same resource', () => {
  const url1 = 'http://example.com/';
  const url2 = 'http://example2.com/';
  const name = 'example';

  const sendThe = SendThe({ [url1]: name, [url2]: name });
  expect(sendThe.get(name)).toEqual([url1, url2]);
});

it('should return all the endpoints that match all the resources', () => {
  const url1 = 'http://example.com/';
  const url2 = 'http://example2.com/';
  const name1 = 'example';
  const name2 = 'example-2';

  const sendThe = SendThe({ [url1]: name1, [url2]: name2 });
  expect(sendThe.get([name1, name2])).toEqual([url1, url2]);
});

it('should keep the cache', () => {
  const url1 = 'http://example.com/';
  const url2 = 'http://example2.com/';
  const name1 = 'example';
  const name2 = 'example-2';

  const sendThe = SendThe({ [url1]: name1, [url2]: name2 });
  expect(sendThe.cache).toEqual({ [url1]: [name1], [url2]: [name2] });
});
