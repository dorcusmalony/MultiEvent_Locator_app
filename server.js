const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes); // Updated prefix

app.get('/', (req, res) => {
  res.send('Event Locator API');
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});