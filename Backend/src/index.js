const express = require('express');
const cors = require('cors');

const esemenyRoute = require('./routes/esemenyek')
const felhasznaloRoute = require('./routes/felhasznalok')
const hirekRoute = require('./routes/hirek')

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
app.use('/api/felhasznalok', felhasznaloRoute);
app.use('/api/hirek', hirekRoute);

app.listen(port, () => {
    console.log(`Listening on ${port}...`);
})