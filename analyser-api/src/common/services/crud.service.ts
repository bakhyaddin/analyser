import { UUID } from 'crypto';
import { AbstractEntity } from '../database/postgres/abstract.entity';
import { AbstractRepository } from '../database/postgres/abstract.repository';

export class CrudService<Entity extends AbstractEntity<Entity>> {
  constructor(protected readonly repository: AbstractRepository<Entity>) {}

  /**
   * Lists records
   * @returns {Promise<Entity[]>}
   */
  async list(): Promise<Entity[]> {
    return this.repository.find({});
  }

  /**
   * Fetches a record by id
   * @param {string} id
   * @returns {Promise<Entity | null>}
   */
  async getById(id: UUID): Promise<Entity | null> {
    return this.repository.findOneById(id);
  }

  /**
   * Deletes a record
   * @param {string} id
   * @returns {Promise<number>}
   */
  async delete(id: UUID): Promise<number> {
    return this.repository.findOneByIdAndDelete(id);
  }
}
