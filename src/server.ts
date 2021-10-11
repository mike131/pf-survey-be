import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';
import { connect } from './utils/db';

import questionRoutes from './resources/question/question.router';
import answerRoutes from './resources/answer/answer.router';

export const app = express();
app.disable('x-powered-by');

// Register some basic helper/cors/logging middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/question', questionRoutes);
app.use('/api/answer', answerRoutes);

const server = createServer(app);
export const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: config.wsOrigins,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // Basic room joining
  socket.on('msg:join', (data) => {
    socket.join(data.questionId);
    console.log(`User Joined Room ${data.questionId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnecting `, socket.rooms);
  });
});

export const start = async (): Promise<void> => {
  try {
    await connect(config.dbUrl);

    // Listen
    server.listen(config.port, () => {
      console.log(`Listening on http://localhost:${config.port}`);
    });
  } catch (e) {
    console.error(e);
  }
};
