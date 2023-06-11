import express from "express";
import { getQuiz } from "../controllers/quizController";

const router = express.Router();
router.post('/', getQuiz);

export default router;