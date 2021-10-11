import { Schema, model, SchemaTypes, Document, Types } from 'mongoose';

export interface IAnswer extends Document {
  body: string;
  question: Types.ObjectId;
  createdAt: Date;
}

const answerSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    questionId: {
      type: SchemaTypes.ObjectId,
      ref: 'question',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  }
);

export const Answer = model<IAnswer>('answer', answerSchema, 'answers', true);
