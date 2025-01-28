import { FileType } from '@common/types';
import type { Readable } from 'stream';

type Options = { bucket?: string };

export abstract class FileStorage {
  abstract getObject(key: string, options?: Options): Promise<Readable>;
  abstract getPresignedPostUrl(
    options: Options & { expiresIn?: number; fileType: FileType },
  ): Promise<{ signedUrl: string; objectKey: string }>;
  abstract removeObject(key: string, options?: Options): Promise<void>;
}
