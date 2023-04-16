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

            esemeny_lista = await Esemenyek.find({ _id: { $in: kovetesek }, torolve: false }).sort(idorend == 'true' ? { kezdes: 1 } : {}).limit(limit > 0 ? limit : 100).skip(skip > 0 ? skip : 0);
        }
        else
            esemeny_lista = await Esemenyek.find({ torolve: false }).sort(idorend == 'true' ? { kezdes: 1 } : {}).limit(limit > 0 ? limit : 100).skip(skip > 0 ? skip : 0);

        res.status(200).send(esemeny_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/felhasznaloi/:felhID/', async (req, res) => {

    const { felhID } = req.params;

    try {
        const esemenyek_altala = await Esemenyek.find({ letrehozo: felhID, torolve: false });

        res.status(200).send(esemenyek_altala)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/szures-hirhez', async (req, res) => {

    const { kifejezes } = req.query;

    try {
        const talalatok = await Esemenyek.find({ megnevezes: { $regex: new RegExp(kifejezes, 'i') } }).select('megnevezes kezdes')
        res.status(200).send(talalatok)
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

router.put('/:esemenyID/', async (req, res) => {

    // Ez nem a HTML-es hirID, ez az adatbázisos
    const { esemenyID } = req.params;

    const { megnevezes, tipus, kezdes, vege, oraKell, leiras, helyszin } = req.body;

    try {

        await Esemenyek.updateOne({ _id: esemenyID }, {
            $set: {
                megnevezes,
                tipus,
                kezdes,
                vege,
                oraKell,
                leiras,
                helyszin
            }
        });

        const esemeny = await Esemenyek.findById(esemenyID);

        res.status(200).send(esemeny)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { megnevezes, tipus, kezdes, vege, oraKell, leiras, helyszin, letrehozo } = req.body;

    try {

        const kezdesDatum = new Date(kezdes);
        const vegeDatum = new Date(vege);

        const ujEsemeny = await Esemenyek.create({
            megnevezes,
            tipus,
            kezdes: kezdesDatum,
            vege: vegeDatum,
            oraKell,
            helyszin,
            leiras,
            letrehozo
        })

        res.status(200).send(ujEsemeny)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.delete('/:esemenyID', async (req, res) => {

    const { esemenyID } = req.params;

    try {
        await Esemenyek.updateOne({ _id: esemenyID }, { $set: { torolve: true } });

        res.status(200).send('Esemény törölve!')
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.put('/torlesUpdate', async (req, res) => {
    try {
        await Esemenyek.updateMany({}, { $set: { torolve: false } });

        res.status(200).send('Események új mezője hozzáadva!')
    }
    catch (error) {
        res.send({ msg: error })
    }
});

module.exports = router