import { Schema, model, Document } from 'mongoose';

export interface IQuestion extends Document {
  body: string;
  disallowedStrings: string[];
}

const questionSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    disallowedStrings: {
      type: [String],
      required: false,
      default: [],
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

export const Question = model<IQuestion>(
  'question',
  questionSchema,
  'questions',
  true
);
