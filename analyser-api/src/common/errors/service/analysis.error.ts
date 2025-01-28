import { EntityNotFoundError } from './service.error';

export class AnalysisNotFound extends EntityNotFoundError {
  constructor() {
    super('Analysis');
  }
}
