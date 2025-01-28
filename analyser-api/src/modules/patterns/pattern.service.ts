import { lastValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';

// entities
import { Analysis } from '@modules/analysis/analysis.entity';
import { Pattern } from './pattern.entity';

// services
import { CrudService } from '@common/services/crud.service';

// repositories
import { PatternRepository } from './pattern.repository';

// types
import type { UUID } from 'crypto';
import {
  NORMALYSER_SERVICE_NAME,
  Transaction,
  NormalyserServiceClient,
  ISODate,
} from '@common/types';

// utils
import { normaliseDecimal } from '@common/utils';

@Injectable()
export class PatternService extends CrudService<Pattern> {
  private normalyserService: NormalyserServiceClient;

  constructor(
    repository: PatternRepository,
    @Inject(NORMALYSER_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    super(repository);
    this.normalyserService = this.client.getService<NormalyserServiceClient>(
      NORMALYSER_SERVICE_NAME,
    );
  }

  public async normaliseAndCreate(
    transactions: Transaction[],
    analysisId: UUID,
  ) {
    const stream = this.normalyserService.normalizePattern({ transactions });
    const { normalisedPatterns } = await lastValueFrom(stream);

    const patternsToCreate = normalisedPatterns.map(
      (normalisedPattern) =>
        new Pattern({
          type: normalisedPattern.type,
          merchant: normalisedPattern.merchant,
          amount: normaliseDecimal(normalisedPattern.amount),
          frequency: normalisedPattern.frequency,
          nextExpected: normalisedPattern.nextExpected as ISODate,
          confidence: normaliseDecimal(normalisedPattern.confidence) || 0.0,
          notes: normalisedPattern.notes,
          analysis: new Analysis({ id: analysisId }),
        }),
    );
    return this.repository.save(patternsToCreate);
  }
}
