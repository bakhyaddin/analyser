import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnalysisDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  objectId: string;
}
