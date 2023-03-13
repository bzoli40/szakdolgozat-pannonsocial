const mongoose = require('mongoose');

const FelhasznaloSchema = new mongoose.Schema({
    teljes_nev: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    felh_nev: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    felh_tipus: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('felhasznalo', FelhasznaloSchema, 'felhasznalok')