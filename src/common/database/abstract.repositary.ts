import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
export abstract class AbstractRepositary<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  //   lean just removes the additional unwanted  mongoose operation field
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .find({ ...filterQuery })
      .lean<TDocument>();
    if (!document) {
      this.logger.warn('Document not found ', filterQuery);
      throw new NotFoundException();
    }
    return document;
  }
  async findOneAndUpdate(
    filteredQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filteredQuery, update, {
        new: true,
      })
      .lean<TDocument>();
    if (!document) {
      this.logger.warn('Document not found ', filteredQuery);
      throw new NotFoundException();
    }

    return document;
  }

  async find(filteredQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filteredQuery).lean<TDocument[]>();
  }

  async findOneAndDelete(
    filterdQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return await this.model.findByIdAndDelete(filterdQuery);
  }
}
