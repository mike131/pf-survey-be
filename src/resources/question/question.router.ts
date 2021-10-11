import { Router } from 'express';
import controllers from './question.controllers';

const router = Router();

// /api/question
// return all questions
router.route('/').get(controllers.getMany).post(controllers.createOne);

// /ap/question/:id
// return single question, used for answering
router.route('/:id').get(controllers.getOne);

export default router;
