const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const sendIndex = (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
};

app.get('/', sendIndex);
app.get('/app', sendIndex);
app.get('/app/login', sendIndex);
app.get('/app/register', sendIndex);
app.get('/app/search', sendIndex);
app.get('/app/profile', sendIndex);
app.get('/app/product/:id', sendIndex);

app.listen(9000);