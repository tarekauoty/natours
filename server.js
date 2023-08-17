const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  shutting down...');
  server.close(() => process.exit(1));
});
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION  Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
