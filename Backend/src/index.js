const express = require('express');
const cors = require('cors');

const esemenyRoute = require('./routes/esemenyek')

require('./database')

const app = express();
const port = 3001;

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} -> ${req.url}`);
    next();
})

app.use('/api/esemenyek', esemenyRoute);

app.listen(port, () => {
    console.log(`Listening on ${port}...`);
})