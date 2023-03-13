const mongoose = require('mongoose');

mongoose.set('strictQuery', true)

mongoose
    .connect('mongodb+srv://admin:IsAvQlkjH2TAExpD@napelem-rendszerfejlesz.qilfv1w.mongodb.net/ceg?retryWrites=true&w=majority')
    .then(() => console.log('Csatlakozva a Napelem adatbázishoz!'))
    .catch((error) => console.log(error))