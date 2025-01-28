import { Injectable } from '@nestjs/common';

import { CrudService } from '@common/services/crud.service';

// entities
import { Analysis } from './analysis.entity';
import { Merchant } from '@modules/merchants/merchant.entity';
import { Pattern } from '@modules/patterns/pattern.entity';

// services
import { FileService } from '@file/file.service';
import { MerchantService } from '@modules/merchants/merchant.service';
import { PatternService } from '@modules/patterns/pattern.service';

// repositories
import { AnalysisRepository } from './analysis.repository';

// types
import type { UUID } from 'crypto';
import { Transaction } from '@common/types';

// errors
import { AnalysisNotFound } from '@common/errors';

@Injectable()
export class AnalysisService extends CrudService<Analysis> {
  constructor(
    repository: AnalysisRepository,
    private readonly fileService: FileService,
    private readonly merchantService: MerchantService,
    private readonly patternService: PatternService,
  ) {
    super(repository);
  }

  public async create(objectId: string) {
    const file = await this.fileService.create(objectId);
    return this.repository.save({
      file,
    });
  }

  public async getMerchantData(analysisId: UUID): Promise<Merchant[]> {
    const existingAnalysis = await this.repository.findOneById(analysisId, {
      merchants: true,
      file: true,
    });
    if (!existingAnalysis) {
      throw new AnalysisNotFound();
    }
    if (existingAnalysis.merchants.length > 0) {
      return existingAnalysis.merchants;
    }

    // normalise, create and return merchant data
    const transactions = (await this.fileService.getCsvFileObject(
      existingAnalysis.file.objectId,
    )) as Transaction[];
    return this.merchantService.normaliseAndCreate(transactions, analysisId);
  }

  public async getPatternData(analysisId: UUID): Promise<Pattern[]> {
    const existingAnalysis = await this.repository.findOneById(analysisId, {
      patterns: true,
      file: true,
    });
    if (!existingAnalysis) {
      throw new AnalysisNotFound();
    }
    if (existingAnalysis.patterns.length > 0) {
      return existingAnalysis.patterns;
    }

    // normalise, create and return pattern data
    const transactions = (await this.fileService.getCsvFileObject(
      existingAnalysis.file.objectId,
    )) as Transaction[];
    return this.patternService.normaliseAndCreate(transactions, analysisId);
  }
}
