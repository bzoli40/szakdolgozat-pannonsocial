const mongoose = require('mongoose');

mongoose.set('strictQuery', true)

mongoose
    .connect('mongodb+srv://admin:admin@cluster-szakdolgozat-pa.xvrhoqu.mongodb.net/adatbazis?retryWrites=true&w=majority')
    .then(() => console.log('Csatlakozva a Pannon Social adatbázishoz!'))
    .catch((error) => console.log(error))