export type HTTPMethod =
  'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export interface Response {
  text: string;
  body: any;
  files: any;
  header: any;
  type: string;
  charset: string;
  status: number;
  statusType: number;
  info: boolean;
  ok: boolean;
  redirect: boolean;
  clientError: boolean;
  serverError: boolean;
  error: Error;
  accepted: boolean;
  noContent: boolean;
  badRequest: boolean;
  unauthorized: boolean;
  notAcceptable: boolean;
  notFound: boolean;
  forbidden: boolean;
  xhr: XMLHttpRequest;
  get(header: string): string;
}

export interface RequestOptions {
  url: string;
  method: HTTPMethod;
  query?: Object;
  send?: Object;
  headers?: Object;
  accept?: string;
  type?: string;
  user?: string;
  password?: string;
  field?: Object;
  attach?: Array<Attachment>;
  agent?: AgentOptions;
  withCredentials?: boolean;
  redirects?: number;
  lazy?: boolean;
}

export interface Attachment {
  name: string;
  path: string;
  filename?: string;
}

export interface AgentOptions {
  key: string;
  cert: string;
}
