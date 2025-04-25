import express from 'express';
import router from './routes.js';
import cors from 'cors';

const App = express();
const PORT = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

App.use(cors(corsOptions));
App.use(express.json());
App.use('/', router);

App.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});