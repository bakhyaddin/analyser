import { Module } from '@nestjs/common';

import { PostgresModule } from '@providers/postgres/provider.module';

import { Pattern } from './pattern.entity';
import { PatternRepository } from './pattern.repository';
import { PatternService } from './pattern.service';

@Module({
  imports: [PostgresModule.forFeature([Pattern])],
  providers: [PatternRepository, PatternService],
  exports: [PatternRepository, PatternService],
})
export class PatternModule {}
