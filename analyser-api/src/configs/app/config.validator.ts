import {
  Min,
  Max,
  IsNumber,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';

import { AppEnvironment } from '@common/enums';

export class AppVariablesValidation {
  @IsNotEmpty()
  @IsEnum(AppEnvironment)
  NODE_ENV: AppEnvironment;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(65535)
  API_PORT: number;

  @IsNotEmpty()
  @IsString()
  CORS_ALLOWED_ORIGINS: string;
}
