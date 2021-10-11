import { Request, Response } from 'express';
import { Model } from 'mongoose';

export const getMany =
  (model) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const docs = await model.find().lean().exec();

      res
        .status(200)
        .json({ data: docs.map((doc) => new model(doc).toJSON()) });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  };

export const getOne =
  (model) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await model.findOne({ _id: req.params.id }).lean().exec();

      if (!doc) {
        return res.status(400).end();
      }

      res.status(200).json({ data: new model(doc).toJSON() });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  };

export const createOne =
  <T>(model: Model<T>) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await model.create({ ...req.body });
      res.status(201).json({ data: new model(doc).toJSON() });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  };

export const crudControllers = <T>(
  model: Model<T>
): {
  [fnKey: string]: (req: Request, res: Response) => Promise<void>;
} => ({
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model),
});
