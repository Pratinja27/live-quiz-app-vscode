import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const createQuiz = (title) => api.post('/quiz', { title });
export const startQuiz = (quizId) => api.post(`/quiz/${quizId}/start`);
export const endQuiz = (quizId) => api.post(`/quiz/${quizId}/end`);
export const getQuiz = (quizId) => api.get(`/quiz/${quizId}`);
export const getAllQuizzes = () => api.get('/quiz');

export const addQuestion = (quizId, questionData) => api.post(`/question/quiz/${quizId}`, questionData);
export const getQuestions = (quizId) => api.get(`/question/quiz/${quizId}`);
export const getRandomQuestion = (quizId) => api.get(`/question/quiz/${quizId}/random`);

export const joinQuiz = (name, quizId) => api.post('/player/join', { name, quizId });
export const submitAnswer = (playerId, questionId, selectedOption) =>
  api.post('/player/submit', { playerId, questionId, selectedOption });
export const getPlayerScore = (playerId) => api.get(`/player/${playerId}/score`);
export const getLeaderboard = (quizId) => api.get(`/player/quiz/${quizId}/leaderboard`);
export const getPlayersInQuiz = (quizId) => api.get(`/player/quiz/${quizId}`);

export default api;
