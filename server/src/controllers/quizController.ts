import {Configuration, OpenAIApi} from "openai";
import {Request, Response} from "express";

/**
 * Interface for types that represent query for openAI API
 * @interface
 */
interface Query {
    prompt: String
}

/**
 * Interface for types that represent the response object sent back to consumer of API
 * @interface
 */
interface questionAnswerList {
    [key: string]: Array<string>
}

const API_KEY = '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'
const openai = new OpenAIApi(new Configuration({
    apiKey: API_KEY
}))

/**
 * @brief Controller function to get a list of questions and answers based on a prompt
 * @param req Request object
 * @param res Response object
 * @return void
 */
export const getQuiz = async (req: Request, res: Response) => {
    const request: Query = req.body;
    const query: String = request.prompt;
    const content = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.6,
        messages: [{
            role: "user",
            content: `Can you generate a list of very high quality questions and answers using the following input text?: ${query}. The expected output should be in JSON format with example format being {Placeholder Question 1: Answer 1, Placeholder Question 2: Answer 2, ...}`,
        }],
    })
    //convert the string response into a nested array
    const response: string = content.data!.choices[0].message!.content;
    const jsonResponse: Object = JSON.parse(response);
    console.log(jsonResponse);
    const questions: Array<string> = Object.keys(jsonResponse);
    const answers: Array<string> = Object.values(jsonResponse);
    if (questions.length !== answers.length) {
        res.status(500).json("API response it not valid");
    }
    let questionObject: questionAnswerList = {};
    for (let i = 0; i < questions.length; i++) {
        questionObject[`Q${i}`] = [questions[i], answers[i]];
    }
    res.json(questionObject).status(200);
}
