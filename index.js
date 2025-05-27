require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const router = require('./config/routes');
const emailRoutes = require('./routes/emailRoutes');
const progressRoutes = require('./routes/progressRoutes');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/financeApi', router);
app.use('/financeApi', emailRoutes);
app.use('/api/progress', progressRoutes);

sequelize
  .sync()
  .then(() => {
    console.log('Database Synced');
  })
  .catch((error) => {
    console.log('Error in Syncing Database', error);
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
