import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import type { UUID } from 'crypto';

export class DeleteAnalysisDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: UUID;
}
