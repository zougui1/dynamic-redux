import { Middleware } from 'redux';
import { allActions } from '../common';

export interface IMiddleware {
  readonly actionKind: keyof typeof allActions;

  handler: Middleware;
}
