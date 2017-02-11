import * as assert from 'assert';

import { RequestOptions, Response, request } from './';

describe('request', () => {
  describe('given request options', () => {
    it('returns a stream of response', (done) => {
      const rootUrl = 'https://jsonplaceholder.typicode.com';

      const options: RequestOptions =
        {
          url: `${rootUrl}/posts/1`,
          method: 'GET',
        };

      request(options).observe((response: Response) => {
        assert.ok(response.ok);
        assert.strictEqual(response.body.userId, 1);
        assert.strictEqual(response.body.id, 1);
        assert.strictEqual(typeof response.body.title, 'string');
        assert.strictEqual(typeof response.body.body, 'string');

        done();
      });
    });
  });
});
