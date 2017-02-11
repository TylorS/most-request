import { Disposable, Scheduler, Sink, Source, Stream } from 'most';
import { RequestOptions, Response } from './types';

import { MulticastSource } from '@most/multicast';
import { Request } from 'superagent';
import { optionsToSuperagent } from './optionsToSuperagent';

export function request(options: RequestOptions): ResponseStream {
  return new ResponseStream(options);
}

export class ResponseStream extends Stream<Response> {
  private _options: RequestOptions;

  constructor (options: RequestOptions) {
    super(new MulticastSource(new RequestSource(options)));
    this._options = options;
  }

  public options(): RequestOptions {
    return this._options;
  }
}

class RequestSource implements Source<Response> {
  constructor(private options: RequestOptions) {}

  public run(sink: Sink<Response>, scheduler: Scheduler) {
    return new RequestDisposable(sink, scheduler, this.options);
  }
}

class RequestDisposable implements Disposable<any> {
  private sink: Sink<Response>;
  private scheduler: Scheduler;
  private request: Request;

  constructor(sink: Sink<Response>, scheduler: Scheduler, options: RequestOptions) {
    this.sink = sink;
    this.scheduler = scheduler;

    const request = optionsToSuperagent(options);

    this.request = request;

    request.then(response => this.eventAndEnd(response), err => this.error(err));
  }

  public dispose() {
    this.request.abort();
  }

  private eventAndEnd(response: Response) {
    this.sink.event(this.scheduler.now(), response);
    this.sink.end(this.scheduler.now());
  }

  private error(err: any) {
    this.sink.error(this.scheduler.now(), err);
  }
}
