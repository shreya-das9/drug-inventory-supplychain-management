const express = require('express');
const app = express();

app.get('/', (req, res) => res.json({ok: true}));

app.listen(3001, () => console.log('Test server on 3001'));