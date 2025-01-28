import { lastValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';

// entities
import { Analysis } from '@modules/analysis/analysis.entity';
import { Merchant } from './merchant.entity';

// services
import { CrudService } from '@common/services/crud.service';

// repositories
import { MerchantRepository } from './merchant.repository';

// utils
import { normaliseDecimal } from '@common/utils';

// types
import type { UUID } from 'crypto';
import {
  NORMALYSER_SERVICE_NAME,
  Transaction,
  NormalyserServiceClient,
} from '@common/types';

@Injectable()
export class MerchantService extends CrudService<Merchant> {
  private normalyserService: NormalyserServiceClient;

  constructor(
    repository: MerchantRepository,
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
    const stream = this.normalyserService.normalizeMerchant({ transactions });
    const res = await lastValueFrom(stream);
    const normalisedMerchants = res.normalisedMerchants;

    const merchantsToCreate = normalisedMerchants.map(
      (normalisedMerchant) =>
        new Merchant({
          name: normalisedMerchant.name || '',
          originalName: normalisedMerchant.originalName || '',
          category: normalisedMerchant.category || '',
          subCategory: normalisedMerchant.subCategory || '',
          isSubscription: normalisedMerchant.isSubscription || false,
          flags: normalisedMerchant.flags || [],
          confidence: normaliseDecimal(normalisedMerchant.confidence) || 0.0,
          analysis: new Analysis({ id: analysisId }),
        }),
    );
    return this.repository.save(merchantsToCreate);
  }
}
