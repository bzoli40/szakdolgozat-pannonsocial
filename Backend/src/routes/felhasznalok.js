const { Router, response } = require('express');
const router = Router();

const Felhasznalok = require('../database/schemas/Felhasznalo');

router.get('/', async (req, res) => {

    try {
        const felh_lista = await Felhasznalok.find();

        res.status(200).send(felh_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:felhasznaloID', async (req, res) => {

    const { felhasznaloID } = req.params;

    try {
        let felhasznalo = await Felhasznalok.findById(felhasznaloID);

        res.status(200).send(felhasznalo)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/firebase/:firebaseID', async (req, res) => {

    const { firebaseID } = req.params;

    try {
        let felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        res.status(200).send(felhasznalo)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:firebaseID/jogok', async (req, res) => {

    const { firebaseID } = req.params;

    try {
        const felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        res.status(200).send(felhasznalo.jogok)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:firebaseID/kovetett_esemenyek', async (req, res) => {

    const { firebaseID } = req.params;

    try {
        const felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        res.status(200).send(felhasznalo.kovetett_esemenyek)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { teljes_nev, email, idFireBase, szervezet } = req.body;

    try {

        const jogok = {
            news_create: false,
            news_edit: false,
            news_delete: false,
            events_create: false,
            events_edit: false,
            events_delete: false
        }

        const ujFelhasznalo = await Felhasznalok.create({
            teljes_nev: teljes_nev,
            email: email,
            jogok: jogok,
            idFireBase: idFireBase,
            szervezet: (szervezet != undefined && szervezet.length > 0) ? szervezet : ""
        })

        res.status(200).send(ujFelhasznalo)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.put('/:firebaseID/jogmodositas', async (req, res) => {
    const { firebaseID } = req.params;
    const frissitendo_jogok = req.body;

    try {
        let felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        for (const [jog, ujAllapot] of Object.entries(frissitendo_jogok)) {
            if (felhasznalo.jogok.get(jog) != undefined)
                felhasznalo.jogok.set(jog, ujAllapot == 'true')
            else if (jog == "minden") {
                felhasznalo.jogok.forEach((a2, j2) => {
                    felhasznalo.jogok.set(j2, ujAllapot == 'true')
                })
            }
        }

        await felhasznalo.save();

        res.status(200).send(felhasznalo.jogok)
    }
    catch (error) {
        res.send({ msg: error })
    }
})

router.put('/:firebaseID/esemeny/:esemenyID', async (req, res) => {
    const { firebaseID, esemenyID } = req.params;
    const { kovetni } = req.query

    try {

        const kovetniBool = kovetni == "true"

        // Felhasználó
        let felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        const felh_kovetesek = felhasznalo.kovetett_esemenyek;

        // Megnézzük, hogy nem-e ellentmondó a backend parancs (pl. követte és követni akarja)
        if (felh_kovetesek.includes(esemenyID) && kovetniBool) {
            res.status(400).send({ msg: "HIBA: Ezt az eseményt már követed" })
            return;
        }
        else if (!felh_kovetesek.includes(esemenyID) && !kovetniBool) {
            res.status(400).send({ msg: "HIBA: Ezt az eseményt nem követted" })
        }
        else {
            if (kovetniBool)
                await Felhasznalok.updateOne({ idFireBase: firebaseID }, { $push: { kovetett_esemenyek: esemenyID } })
            else
                await Felhasznalok.updateOne({ idFireBase: firebaseID }, { $pull: { kovetett_esemenyek: esemenyID } })
        }

        felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        res.status(200).send({ msg: kovetniBool ? "Követed az eseményt!" : "Kikövetted az eseményt!", data: felhasznalo.kovetett_esemenyek })
    }
    catch (error) {
        res.send({ msg: error })
    }
})

module.exports = router