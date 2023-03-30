const { Router, response } = require('express');
const router = Router();

const Esemenyek = require('../database/schemas/Esemeny');
const Felhasznalok = require('../database/schemas/Felhasznalo');

router.get('/', async (req, res) => {

    try {
        const esemeny_lista = await Esemenyek.find();

        res.status(200).send(esemeny_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/szures', async (req, res) => {

    const { skip, limit, idorend, koveto } = req.query;

    try {
        let esemeny_lista = []

        if (koveto != undefined) {

            const felhasznalo = await Felhasznalok.findOne({ idFireBase: koveto });
            const kovetesek = felhasznalo.kovetett_esemenyek;

            esemeny_lista = await Esemenyek.find({ _id: { $in: kovetesek } }).sort(idorend == 'true' ? { kezdes: 1 } : {}).limit(limit > 0 ? limit : 100).skip(skip > 0 ? skip : 0);
        }
        else
            esemeny_lista = await Esemenyek.find().sort(idorend == 'true' ? { kezdes: 1 } : {}).limit(limit > 0 ? limit : 100).skip(skip > 0 ? skip : 0);

        res.status(200).send(esemeny_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:esemenyID', async (req, res) => {

    const { esemenyID } = req.params;

    try {
        const esemeny = await Esemenyek.findById(esemenyID);

        if (!esemeny) {
            res.status(400).send({ msg: "HIBA: Nincs esemény az ID-val" })
            return;
        }

        res.status(200).send(esemeny)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { megnevezes, tipus, kezdes, vege, oraKell, leiras, helyszin } = req.body;

    try {

        const kezdesDatum = new Date(kezdes);
        const vegeDatum = new Date(vege);

        const ujEsemeny = await Esemenyek.create({
            megnevezes: megnevezes,
            tipus: tipus,
            kezdes: kezdesDatum,
            vege: vegeDatum,
            oraKell: oraKell,
            helyszin: helyszin,
            leiras: leiras
        })

        res.status(200).send(ujEsemeny)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

module.exports = router