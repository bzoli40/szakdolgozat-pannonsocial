const mongoose = require('mongoose');

const MegrendelesSchema = new mongoose.Schema({
    ar: {
        type: mongoose.SchemaTypes.Number
    },
    leiras: {
        type: mongoose.SchemaTypes.String,
        require: true
    },
    helyszin: {
        type: mongoose.SchemaTypes.String,
        require: true
    },
    allapot: {
        type: mongoose.SchemaTypes.String,
        require: true
    },
    megrendelo_neve: {
        type: mongoose.SchemaTypes.String,
        require: true
    },
    megrendelo_telefonszam: {
        type: mongoose.SchemaTypes.Number,
        require: true
    },
    munkadij: {
        type: mongoose.SchemaTypes.Number
    },
    idoigeny: {
        type: mongoose.SchemaTypes.Number
    }
}, { versionKey: false });

module.exports = mongoose.model('megrendeles', MegrendelesSchema, 'megrendelesek')