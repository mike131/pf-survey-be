import { Router } from 'express';
import controllers from './answer.controllers';

const router = Router();

// /ap/answer/:questionId
// return or create answers for a question
router
  .route('/:questionId')
  .get(controllers.getAnswersByQuestion) // For this route, if socket option is passed, open stream
  .post(controllers.createAnswer);

export default router;
