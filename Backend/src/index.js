const express = require('express');
const cors = require('cors');

const alkatreszRoute = require('./routes/alkatreszek')
const rekeszRoute = require('./routes/rekeszek')
const felhasznaloRoute = require('./routes/felhasznalok')
const megrendelesRoute = require('./routes/megrendelesek')
const anyagigenyRoute = require('./routes/anyagigenyek')

require('./database')

const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} -> ${req.url}`);
    next();
})

app.use('/api/alkatreszek', alkatreszRoute);
app.use('/api/rekeszek', rekeszRoute);
app.use('/api/felhasznalok', felhasznaloRoute);
app.use('/api/megrendelesek', megrendelesRoute);
app.use('/api/anyagigenyek', anyagigenyRoute);

app.listen(port, () => {
    console.log(`Listening on ${port}...`);
})