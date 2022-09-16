const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static('build'));
app.listen(PORT, () => console.log(`Listen on port ${PORT}`));