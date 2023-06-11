import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import quizRoutes from "./src/routes/quizRoutes";

dotenv.config({path: `.env.local`, override: true});

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb",}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use('/quiz', quizRoutes)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});