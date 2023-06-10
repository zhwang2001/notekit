import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({path: `.env.local`, override: true});

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Test of notekit server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});