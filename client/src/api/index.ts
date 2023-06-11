import axios from 'axios';

const API = axios.create({ baseURL: '/api' })

export const getQuiz = (prompt: Object) => API.post('/quiz', prompt);