const express = require('express');
const { resolve } = require('path');
const authRoutes = require('./src/routes/auth');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});