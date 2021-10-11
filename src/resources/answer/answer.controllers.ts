import { Request, Response } from 'express';
import { io } from '../../server';
import { IQuestion, Question } from '../question/question.model';
import { Answer } from './answer.model';

export const createAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body } = req.body;

    // Look up Question
    const question = await getQuestion(req.params.questionId);

    // Can't answer a question that doesn't exist
    if (!question) {
      res.status(400).json({ data: [], error: 'Question does not exist' });
    }

    // Check disallowed answers if we have any
    if (question.disallowedStrings.length) {
      // Need to check if given answer is not allowed

      const matched = question.disallowedStrings.filter((disallowedString) => {
        // Very simple filtering/matching
        // - Ignore Case
        // - Ignore ', for don't, can't, etc

        return (
          disallowedString.replace("'", '').toLowerCase() ===
          body.replace("'", '').toLowerCase()
        );
      });

      // Return error if we found a disallowed string
      if (matched.length) {
        res.status(400).json({
          data: [],
          error: `Answer not allowed for '${question.body}'`,
        });
      }
    }

    const answer = await Answer.create({
      body,
      questionId: req.params.questionId,
    });

    // Broadcast to anyone in the "room" for this question
    io.in(req.params.questionId).emit('newAnswer', new Answer(answer).toJSON());

    res.status(200).json({ data: new Answer(answer).toJSON() });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getAnswersByQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const answers = await Answer.find({
      questionId: req.params.questionId,
    });

    res
      .status(200)
      .json({ data: answers.map((answer) => new Answer(answer).toJSON()) });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

async function getQuestion(questionId): Promise<IQuestion | undefined> {
  let question;
  try {
    question = new Question(await Question.findById(questionId).lean().exec());
  } catch (e) {
    console.error('AnswerController:getQuestion: ', e);
  }

  return question;
}

export default {
  getAnswersByQuestion,
  createAnswer,
};
