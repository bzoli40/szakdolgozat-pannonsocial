const { Router, response } = require('express');
const router = Router();

const Anyagigenyek = require('../database/schemas/Anyagigenyek');
const utils = require('../utils')

router.get('/', async (req, res) => {

    try {
        const anyagigenyek = await Anyagigenyek.find()

        res.send(anyagigenyek)
    }
    catch (error) {
        res.send({ msg: error })
    }

})

router.get('/hianyzok', async (req, res) => {

    try {
        const hianyzo_anyagigenyek = await Anyagigenyek.aggregate([
            {
                $match: {
                    allapot: 0
                }
            },
            {
                $group: {
                    _id: '$alkatresz',
                    hianyzo_darab: { $sum: '$darab' }
                }
            }
        ])

        res.send(hianyzo_anyagigenyek)
    }
    catch (error) {
        res.send({ msg: error })
    }

})

router.post('/', async (req, res) => {

    const { megrendeles, alkatresz, darab } = req.body;

    try {

        const intDarab = parseInt(darab);

        // Elérhető alkatrész darabszám
        const elerheto_darab = await utils.ElerhetoDarabLekeres(alkatresz);

        const ujAnyagigeny = await Anyagigenyek.create(
            {
                megrendeles: megrendeles,
                alkatresz: alkatresz,
                darab: intDarab,
                allapot: elerheto_darab >= intDarab ? 1 : 0
            });

        res.status(201).send(ujAnyagigeny);

    } catch (error) {
        res.send({ msg: error });
    }

});

// router.put('/integralas/ujAllapotValtozo', async (req, res) => {

//     try {

//         const minden_objektum = await Anyagigenyek.find()

//         for (let x = 0; x < minden_objektum.length; x++) {
//             // Ha még nincs 'allapot' értéke, akkor módosuljon
//             if (minden_objektum[x]?.allapot != undefined) {

//                 console.log(minden_objektum[x].lefoglalva)

//                 if (minden_objektum[x]?.lefoglalva != undefined) {
//                     minden_objektum[x].allapot = minden_objektum[x].lefoglalva ? 1 : 0;
//                     minden_objektum[x].lefoglalva = undefined;
//                 }
//                 else {
//                     minden_objektum[x].allapot = 0;
//                 }
//                 await minden_objektum[x].save();
//             }
//         }

//         res.status(200).send({ msg: "[INTEGRÁLÁS] Anyagigény rekordok integrálása az új objektumsémához megtörtént!" });

//     } catch (error) {
//         res.send({ msg: error });
//     }

// })

module.exports = router;