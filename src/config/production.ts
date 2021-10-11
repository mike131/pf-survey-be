export const config = {
  wsOrigins: ['http://localhost:3001', process.env.APP_FRONTEND],
  dbUrl: process.env.MONGODB_URI,
};
