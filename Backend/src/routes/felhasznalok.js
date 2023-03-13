const { Router, response } = require('express');
const router = Router();

const Felhasznalok = require('../database/schemas/Felhasznalo')

router.get('/', async (req, res) => {

    try {
        const felhasznalok = await Felhasznalok.find()

        res.send(felhasznalok)
    }
    catch (error) {
        res.send({ msg: error })
    }

})

router.put('/:felh_id/tipus', async (req, res) => {

    const { felh_id } = req.params;
    const { ujTipus } = req.query;

    try {

        await Felhasznalok.updateOne({ _id: felh_id }, { felh_tipus: ujTipus });

        if (ujTipus != "szakember" && ujTipus != "raktarvezeto" && ujTipus != "raktaros" && ujTipus != "admin") {

            res.send({ msg: "HIBA: A felhasználó típusa nem megfelelő" });
            return;
        }

        const frissitettFelhasznalo = await Felhasznalok.findById(felh_id)

        res.send(frissitettFelhasznalo);

    }
    catch (error) {
        res.send({ msg: error })
    }

})

router.post('/', async (req, res) => {

    const { nev, felh_nev, tipus } = req.body;

    try {


        // Típusok: "szakember" / "raktarvezeto" / "raktaros" / "admin"


        // Létezik-e már a felhasználó ezzel a username-el?
        const azonos_felh_nevuek = await Felhasznalok.find({ felh_nev: felh_nev })

        if (azonos_felh_nevuek.length > 0) {

            res.send({ msg: "HIBA: Ez a felhasználónév foglalt!" })
            return;
        }

        // Bemeneti értékek ellenőrzése
        if (nev?.length == 0 || felh_nev?.length == 0 || tipus?.length == 0
            || nev == null || felh_nev == null || tipus == null) {

            res.send({ msg: "HIBA: Valami nem lett kitöltve!" })
            return;
        }

        // A felhasználó típus ellenőrzése
        if (tipus != "szakember" && tipus != "raktarvezeto" && tipus != "raktaros" && tipus != "admin") {

            res.send({ msg: "HIBA: A felhasználó típusa nem megfelelő" });
            return;
        }

        const ujFelhasznalo = await Felhasznalok.create(
            {
                teljes_nev: nev,
                felh_nev: felh_nev,
                felh_tipus: tipus
            });

        res.status(201).send({ msg: 'Felhasználó hozzáadva!' })

    }
    catch (error) {
        res.send({ msg: error })
    }

})

module.exports = router