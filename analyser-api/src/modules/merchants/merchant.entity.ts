import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database/postgres/abstract.entity';
import { Analysis } from '../analysis/analysis.entity';

@Entity('merchants')
export class Merchant extends AbstractEntity<Merchant> {
  @Column()
  name: string;

  @Column()
  originalName: string;

  @Column()
  category: string;

  @Column({ type: 'varchar', nullable: true })
  subCategory?: string | null;

  @Column({ type: 'real' })
  confidence: number;

  @Column({ default: false })
  isSubscription: boolean;

  @Column({
    type: 'varchar',
    transformer: {
      to: (flags: string[]): string => flags.join(','),
      from: (flags: string): string[] => (flags ? flags.split(',') : []),
    },
  })
  flags: string[];

  @JoinColumn()
  @ManyToOne(() => Analysis, (analysis) => analysis.merchants, {
    onDelete: 'CASCADE',
  })
  analysis: Analysis;
}
