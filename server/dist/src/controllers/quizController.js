"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuiz = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAIApi(new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));
/**
 * @brief Controller function to get a list of questions and answers based on a prompt
 * @param {object} req Request
 * @param {object} res Response
 * @return {void}
 */
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const query = request.prompt;
        const content = yield openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                    role: "user",
                    content: `Can you generate a list of very high quality questions and answers using the following input text?: ${query}. The response you give me must be in JSON format with example format being {"Placeholder Question 1": "Answer 1", "Placeholder Question 2": "Answer 2", ...}`,
                }],
        });
        //convert the string response into a nested array
        const response = content.data.choices[0].message.content;
        const jsonResponse = JSON.parse(response);
        const questions = Object.keys(jsonResponse);
        const answers = Object.values(jsonResponse);
        if (questions.length !== answers.length) {
            res.status(500).json("API response it not valid");
        }
        let questionObject = {};
        for (let i = 0; i < questions.length; i++) {
            questionObject[`Q${i}`] = [questions[i], answers[i]];
        }
        res.json(questionObject).status(200);
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
        res.status(500).json(error);
    }
});
exports.getQuiz = getQuiz;
