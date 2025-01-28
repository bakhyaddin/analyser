import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

// types
import type { UUID } from 'crypto';

export class CreateAnalysisResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  analysisId: UUID;
}
