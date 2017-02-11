import * as superagent from 'superagent';

import { RequestOptions } from './types';

export function optionsToSuperagent(rawReqOptions: RequestOptions): superagent.Request {
  const reqOptions = sanitizeOptions(rawReqOptions);

  if (typeof reqOptions.url !== `string`) {
    throw new Error(`Please provide a \`url\` property in the request options.`);
  }
  const lowerCaseMethod = (reqOptions.method || 'GET').toLowerCase();
  const sanitizedMethod = lowerCaseMethod === `delete` ? `del` : lowerCaseMethod;

  let request: superagent.Request = (superagent as any)[sanitizedMethod](reqOptions.url);

  if (typeof request.redirects === `function` && reqOptions.redirects)
    request = request.redirects(reqOptions.redirects);

  if (reqOptions.type)
    request = request.type(reqOptions.type);

  if (reqOptions.send)
    request = request.send(reqOptions.send);

  if (reqOptions.accept)
    request = request.accept(reqOptions.accept);

  if (reqOptions.query)
    request = request.query(reqOptions.query);

  if (reqOptions.withCredentials)
    request = request.withCredentials();

  if (reqOptions.agent) {
    request = (request as any).key(reqOptions.agent.key);
    request = (request as any).cert(reqOptions.agent.cert);
  }

  if (typeof reqOptions.user === 'string' && typeof reqOptions.password === 'string')
    request = request.auth(reqOptions.user, reqOptions.password);

  if (reqOptions.headers)
    for (const key in reqOptions.headers)
      if (reqOptions.headers.hasOwnProperty(key))
        request = request.set(key, (reqOptions.headers as any)[key]);

  if (reqOptions.field)
    for (const key in reqOptions.field)
      if (reqOptions.field.hasOwnProperty(key))
        request = request.field(key, (reqOptions.field as any)[key]);

  if (reqOptions.attach)
    for (let i = reqOptions.attach.length - 1; i >= 0; i--) {
      const a = reqOptions.attach[i];
      request = request.attach(a.name, a.path, a.filename);
    }

  return request;
}

function sanitizeOptions(options: RequestOptions): RequestOptions {
  options.withCredentials = options.withCredentials || false;

  options.redirects = typeof options.redirects === 'number' ? options.redirects : 5;

  return options;
}
