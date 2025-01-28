import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { UUID } from 'crypto';
import { ISODateTime } from '@common/types';

export abstract class AbstractEntity<Entity> {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: ISODateTime;

  constructor(entity: Partial<Entity>) {
    Object.assign(this, entity);
  }
}
