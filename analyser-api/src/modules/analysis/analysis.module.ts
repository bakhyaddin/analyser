import { Module } from '@nestjs/common';

import { PostgresModule } from '@providers/postgres/provider.module';

import { Analysis } from './analysis.entity';
import { AnalysisRepository } from './analysis.repository';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';

// modules
import { FileModule } from '@file/file.module';
import { MerchantModule } from '../merchants/merchant.module';
import { PatternModule } from '../patterns/pattern.module';

@Module({
  imports: [
    PostgresModule.forFeature([Analysis]),
    FileModule,
    MerchantModule,
    PatternModule,
  ],
  providers: [AnalysisRepository, AnalysisService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
