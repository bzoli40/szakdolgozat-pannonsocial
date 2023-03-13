const mongoose = require('mongoose');

const AlkatreszSchema = new mongoose.Schema({
    nev: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    egysegar: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    rekesz_max: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('alkatresz', AlkatreszSchema, 'alkatreszek')