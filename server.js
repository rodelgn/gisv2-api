import express from 'express';
import router from './routes.js';

const App = express();
const PORT = 3000;

App.use('/', router);
App.use(express.json());

App.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});