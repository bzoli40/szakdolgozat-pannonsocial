const mongoose = require('mongoose');

const FelhasznaloSchema = new mongoose.Schema({
    teljes_nev: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    jogok: {
        type: mongoose.SchemaTypes.Map,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('felhasznalo', FelhasznaloSchema, 'felhasznalok')