import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/' })

export const getQuiz = (prompt: Object) => API.post('/quiz', prompt);