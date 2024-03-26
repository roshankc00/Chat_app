import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepositary<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<T>) {}
  async create(document: Omit<T, '_id'>): Promise<T> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filteredQuery: FilterQuery<T>): Promise<T> {
    // by default mongooose return with hydrated document which is document of bunch of internal mongoose docuent and internal properties and we dont want them
    const document = await this.model.findOne(filteredQuery).lean<T>(true);

    if (!document) {
      this.logger.warn(
        'Document was not found with the filtered query',
        filteredQuery,
      );
      throw new NotFoundException('Document was not found ');
    }
    return document;
  }

  async findOneAndUpdate(
    filteredQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filteredQuery, updateQuery, {
        new: true,
      })
      .lean<T>(true);

    if (!document) {
      this.logger.warn(
        'Document was not found with the filtered query',
        filteredQuery,
      );
      throw new NotFoundException('Document was not found ');
    }

    return document;
  }

  async find(filteredQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filteredQuery).lean<T[]>(true);
  }

  async findOneAndDelete(filtedQuery: FilterQuery<T>): Promise<T> {
    return await this.model.findOneAndDelete(filtedQuery).lean<T>(true);
  }
}
