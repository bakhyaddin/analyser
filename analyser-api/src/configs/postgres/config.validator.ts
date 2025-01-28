import { Min, Max, IsNumber, IsString } from 'class-validator';

export class PostgresEnvVarsValidation {
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;
}
