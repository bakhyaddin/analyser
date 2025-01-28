import { IsString, IsNotEmpty } from 'class-validator';

export class S3VariablesValidation {
  @IsNotEmpty()
  @IsString()
  S3_BUCKET_REGION: string;

  @IsNotEmpty()
  @IsString()
  S3_BUCKET_NAME: string;
}
