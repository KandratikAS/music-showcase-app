const express = require('express');
const cors = require('cors');
const songRoutes = require('./routes/songs.routes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://music-showcase-app.onrender.com'
    ]
}));

app.use(express.json());
app.use('/api/songs', songRoutes);

module.exports = app;
