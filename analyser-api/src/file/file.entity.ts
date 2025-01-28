import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@common/database/postgres/abstract.entity';

@Entity('files')
export class File extends AbstractEntity<File> {
  @Column()
  objectId: string;
}
