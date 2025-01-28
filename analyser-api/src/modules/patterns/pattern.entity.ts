import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@common/database/postgres/abstract.entity';
import { Analysis } from '../analysis/analysis.entity';

// types
import { ISODate } from '@common/types';

@Entity('patterns')
export class Pattern extends AbstractEntity<Pattern> {
  @Column()
  type: string;

  @Column()
  merchant: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  frequency?: string | null;

  @Column({ type: 'real' })
  confidence: number;

  @Column({ type: 'varchar', nullable: true })
  notes?: string | null;

  @Column({ type: 'date', nullable: true })
  nextExpected?: ISODate | null;

  @JoinColumn()
  @ManyToOne(() => Analysis, (analysis) => analysis.patterns)
  analysis: Analysis;
}
