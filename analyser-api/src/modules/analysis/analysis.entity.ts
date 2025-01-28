import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '@common/database/postgres/abstract.entity';
import { Merchant } from '../merchants/merchant.entity';
import { Pattern } from '../patterns/pattern.entity';
import { File } from '../../file/file.entity';

@Entity('analyses')
export class Analysis extends AbstractEntity<Analysis> {
  @OneToMany(() => Merchant, (merchant) => merchant.analysis)
  merchants: Merchant[];

  @OneToMany(() => Pattern, (pattern) => pattern.analysis)
  patterns: Pattern[];

  @JoinColumn()
  @OneToOne(() => File)
  file: File;
}
