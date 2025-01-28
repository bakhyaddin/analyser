import { FindOptionsRelations, Repository } from 'typeorm';

import { AbstractEntity } from './abstract.entity';

// errors
import { EntityNotFoundError } from '@common/errors';
import { UUID } from 'crypto';

export class AbstractRepository<
  E extends AbstractEntity<E>,
> extends Repository<E> {
  /**
   * If the passed param is an id it looks for the record
   * otherwise return the entitys
   * @param entityRecordOrEntityRecordId Entity Id or Entity
   * @returns Entity
   */
  public async findEntityData(
    entityRecordOrEntityRecordId: E['id'] | E,
    relations?: FindOptionsRelations<E>,
  ): Promise<E> {
    if (typeof entityRecordOrEntityRecordId === 'string') {
      const data = await this.findOne({
        // @ts-expect-error Typeorm cant differentiate the types
        where: {
          id: entityRecordOrEntityRecordId,
        },
        relations,
      });
      if (!data) throw new EntityNotFoundError(this.metadata.name);
      return data;
    }
    return entityRecordOrEntityRecordId;
  }

  /**
   * Finds record by id
   * @param id UUID
   * @returns Promise<E | null>
   */
  public async findOneById(
    id: UUID,
    relations?: FindOptionsRelations<E>,
  ): Promise<E | null> {
    // @ts-expect-error Typeorm cant differentiate the types
    return this.findOne({ where: { id }, relations });
  }

  /**
   * Finds data first then deletes it
   * @param id string
   * @returns number of rows effected
   */
  public async findOneByIdAndDelete(id: UUID): Promise<number> {
    // @ts-expect-error Typeorm cant differentiate the types
    const data = await this.findOneBy({ id });
    if (!data) throw new EntityNotFoundError(this.metadata.name);
    const deleteResult = await this.delete(id);
    return deleteResult.affected ?? 0;
  }
}
