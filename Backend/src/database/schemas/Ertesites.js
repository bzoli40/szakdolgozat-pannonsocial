const mongoose = require('mongoose');

const ErtesitesSchema = new mongoose.Schema({
    ertesitett: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    tartalom: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    linkelt_dok: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    linkelt_tipusa: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    latott: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        default: false
    }
}, { versionKey: false });

module.exports = mongoose.model('ertesites', ErtesitesSchema, 'ertesitesek')