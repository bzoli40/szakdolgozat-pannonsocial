const { Router, response } = require('express');
const router = Router();

const Megrendelesek = require('../database/schemas/Megrendeles');
const Alkatreszek = require('../database/schemas/Alkatresz');
const Anyagigenyek = require('../database/schemas/Anyagigenyek');
const Rekeszek = require('../database/schemas/Rekesz');
const utils = require('../utils')

router.get('/', async (req, res) => {

   // const grid = [  [0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
   //                 [1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
   //                 [0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
   //                 [1, 0, 0, 1, 0, 1, 0, 1, 0, 0]]

    try {
        const megrendeles_lista = await Megrendelesek.find();

      //  let route = findOptimalRoute(grid)

       // console.log(route);

        res.send(megrendeles_lista);
    } catch (error) {
        res.send({ msg: error });
    }

});

router.post('/', async (req, res) => {

    const { leiras, helyszin, allapot, megrendelo_neve, megrendelo_telefonszam } = req.body;

    try {

        const intTelefonszam = parseInt(megrendelo_telefonszam);

        const ujMegrendeles = await Megrendelesek.create(
            {
                leiras: leiras,
                helyszin: helyszin,
                allapot: allapot,
                megrendelo_neve: megrendelo_neve,
                megrendelo_telefonszam: intTelefonszam
            });

        res.status(201).send({ msg: "Projekt hozzáadva!" });

    } catch (error) {
        res.send({ msg: error });
    }

});

router.put('/:megrendeles_id/hozzaad/', async (req, res) => {

    const { megrendeles_id } = req.params;
    const hozzaadando_alkatreszek = req.body

    try {

        await Object.entries(hozzaadando_alkatreszek).map(async ([alkatresz_id, darab]) => {

            // Lefoglaláshoz az elérhető darab
            const elerheto_darab = utils.ElerhetoDarabLekeres(alkatresz_id);

            // Új anyagigény
            await Anyagigenyek.create(
                {
                    megrendeles: megrendeles_id,
                    alkatresz: alkatresz_id,
                    darab: darab,
                    allapot: elerheto_darab >= darab ? 1 : 0
                });

        })

        await Megrendelesek.updateOne({ _id: megrendeles_id }, { allapot: "Draft" })

        // const alkatreszek_foglalt = await Anyagigenyek.find({ megrendeles: megrendeles_id }).select('alkatresz -_id')

        // alkatreszek_foglalt.forEach(function (arrayItem) {
        //     if (arrayItem.alkatresz.toString() === alkatresz_id) {
        //         return sendJSONResponse(res, 404, { "message": "A projekthez már van ilyen alkatrész!" });
        //     }
        // })

        // await Anyagigenyek.updateOne({ megrendeles: megrendeles_id }, { alkatresz: alkatresz_id });

        // const hozzarendelt_alkatresz = await Alkatreszek.findById(alkatresz_id);

        res.status(200).send("Anyagigények feljegyezve!");

    } catch (error) {
        res.send({ msg: error });
    }

});

router.put('/:megrendeles_id/statusz/', async (req, res) => {

    const { megrendeles_id } = req.params;
    const { ujAllapot } = req.body;

    try {

        await Megrendelesek.updateOne({ _id: megrendeles_id }, { allapot: ujAllapot });

        res.status(200).send("[DEVTOOL] Státusz módosítva erre: " + ujAllapot);

    }
    catch (error) {
        res.send({ msg: error });
    }

});

router.put('/:megrendeles_id/ido_koltseg', async (req, res) => {

    const { megrendeles_id } = req.params;
    const { idoigeny, munkadij } = req.body;

    try {

        const idoigenyInt = parseInt(idoigeny);
        const munkadijInt = parseInt(munkadij);

        await Megrendelesek.updateOne({ _id: megrendeles_id }, { idoigeny: idoigenyInt, munkadij: munkadijInt });

        const frissitettMunkadij = await Megrendelesek.findById(megrendeles_id)

        res.send(frissitettMunkadij);

    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.put('/:megrendeles_id/kivetelezes', async (req, res) => {

    const { megrendeles_id } = req.params;

    try {

        // Ne lehessen már futó rendelést újra kivételezni
        const megrendeles = await Megrendelesek.findById(megrendeles_id)

        if (megrendeles.allapot == "InProgress") {
            res.status(400).send({ msg: "HIBA: Nem lehet kivételezni a megrendelést, mert az már egyszer megtörtént" })
            return;
        }

        // Lekérni az összes anyagigényt, ami a megrendeléshez tartozik
        const anyagigenyek_hozza = await Anyagigenyek.find({ megrendeles: megrendeles_id });
        let alkatresz_ID_lista = [];
        let alkatresz_darabok = [];

        // Megnézni, hogy minden a raktárban elérhető-e már hozzá
        for (let x = 0; x < anyagigenyek_hozza.length; x++) {
            if (anyagigenyek_hozza[x].allapot == 0) {
                res.send({ msg: "HIBA: Egy vagy több alkatrész nem lett lefoglalva a megrendeléshez" })
                return;
            }
            else {
                alkatresz_ID_lista.push(anyagigenyek_hozza[x].alkatresz);
                alkatresz_darabok.push(anyagigenyek_hozza[x].darab);
            }
        }

        // Megadni, hogy mi merre található meg, melyik rekeszekben
        const azonos_alkatreszt_tarolok = await Rekeszek.find({ tarolt_alkatresz: { $in: alkatresz_ID_lista } });
        let kiuritett_rekeszek = []; // ID-ket tárol
        let csokkenos_rekeszek = []; // ID-ket tárol és az darabot, amire csökken

        // Végigmegy a rekeszeken, amíg a while ciklus ki nem lép (túlér a listán / 0 lesz a darabok SUM-ja)
        let sz = 0;

        while (sz < azonos_alkatreszt_tarolok.length && alkatresz_darabok.reduce((a, b) => a + b, 0)) {

            // Megkeressük, hogy melyik rekeszről van most szó
            for (let x = 0; x < alkatresz_ID_lista; x++) {
                if (alkatresz_ID_lista[x] == azonos_alkatreszt_tarolok[sz] && alkatresz_darabok[x] > 0) {

                    // Ha a rekeszben több van, mint amennyi kell, akkor csak levon belőle
                    if (azonos_alkatreszt_tarolok[sz].darab > alkatresz_darabok[x]) {
                        csokkenos_rekeszek.push({
                            id: azonos_alkatreszt_tarolok[sz]._id,
                            uj_darab: azonos_alkatreszt_tarolok[sz].darab - alkatresz_darabok[x]
                        })
                        alkatresz_darabok = 0;
                    }

                    // Ha a rekeszben annyi van, amennyi kell, akkor kellő darab nullázódik + rekesz kuka
                    else if (azonos_alkatreszt_tarolok[sz].darab > alkatresz_darabok[x]) {
                        kiuritett_rekeszek.push(azonos_alkatreszt_tarolok[sz]._id)
                        alkatresz_darabok = 0;
                    }

                    // Ha a rekeszben kevesebb van, mint amennyi kell, akkor csökken a kellő darab + rekesz kuka
                    else {
                        kiuritett_rekeszek.push(azonos_alkatreszt_tarolok[sz]._id)
                        alkatresz_darabok = alkatresz_darabok[x] - azonos_alkatreszt_tarolok[sz].darab;
                    }
                }
            }

            sz++;
        }

        // Az anyagigények állapota frissül lezártra / kivételezetre
        for (let x = 0; x < anyagigenyek_hozza.length; x++) {
            anyagigenyek_hozza[x].allapot = 2;
            anyagigenyek_hozza[x].save();
        }

        // Az üresedő rekeszek törlése
        Rekeszek.remove({ _id: { $in: kiuritett_rekeszek } });

        // A fogyó rekeszek tárolt alkatrész darabjának frissítése
        for (let x = 0; x < csokkenos_rekeszek.length; x++) {
            const csokkeno_rekesz = await Rekeszek.findById(csokkenos_rekeszek[x].id)

            csokkeno_rekesz.darab = csokkenos_rekeszek[x].darab;
            csokkeno_rekesz.save();
        }

        // A megrendelés új állapota
        await Megrendelesek.updateOne({ _id: megrendeles_id }, { allapot: "InProgress" });

        res.status(200).send("Alkatrészek kivételezve és megrendelés állapota frissítve!");

    }
    catch (error) {
        res.send({ msg: error })
    }
})

router.put('/:megrendeles_id/lezaras', async (req, res) => {

    const { megrendeles_id } = req.params;
    const { sikeres } = req.query

    try {

        const megrendeles = await Megrendelesek.findById(megrendeles_id)

        if (megrendeles.allapot != "InProgress") {
            res.status(400).send({ msg: "HIBA: Nem lehet lezárni a megrendelést, mert az állapota nem jutott el odáig" })
            return;
        }

        const sikerBoolean = sikeres == "igen"

        await Megrendelesek.updateOne({ _id: megrendeles_id }, { allapot: sikerBoolean ? "Completed" : "Failed" });

        const frissitettMunkadij = await Megrendelesek.findById(megrendeles_id)

        res.send(frissitettMunkadij);

    }
    catch (error) {
        res.send({ msg: error })
    }

});


router.put('/:megrendeles_id/arkalkulacio', async (req, res) => {

    const { megrendeles_id } = req.params;

    try {

        const alkatresz_id = await Anyagigenyek.find({ megrendeles: megrendeles_id });

        //console.log(alkatresz_id);

        let alkatresz_id_lista = [];

        for (let x = 0; x < alkatresz_id.length; x++) {

            if (alkatresz_id[x].allapot == 0) {
                await Megrendelesek.updateOne({ _id: megrendeles_id }, { allapot: "Wait" });
                res.status(400).send({ msg: "FIGYELEM: Nem minden anyag lett lefoglalva! A rendelés új állapota: Wait" })

                return;
            } else {
                await Megrendelesek.updateOne({ _id: megrendeles_id }, { allapot: "Scheduled" });
            }
            alkatresz_id_lista.push(alkatresz_id[x].alkatresz.toString());
        }

        //console.log(alkatresz_id_lista);

        const alk = await Alkatreszek.find({ _id: { $in: alkatresz_id_lista } });

        //console.log(alk);

        let alk_lista = [];

        //console.log(alkatresz_id_lista.length)

        for (let x = 0; x < alkatresz_id_lista.length; x++) {

            alk_lista.push(alk[x]._id);

        }

        //console.log(alk_lista[0]);

        const darab = await Anyagigenyek.find({ megrendeles: megrendeles_id }).select('darab -_id');

        let darab_lista = []

        for (let x = 0; x < darab.length; x++) {
            darab_lista.push(darab[x].darab.valueOf())
        }

        //console.log(darab_lista);

        let egysegar_lista = [];

        for (let x = 0; x < alk.length; x++) {
            egysegar_lista.push(alk[x].egysegar.valueOf());
        }

        //console.log(egysegar_lista);

        const intMunkadij = await Megrendelesek.find({ _id: megrendeles_id }).select('munkadij -_id');

        let munkadij_lista = [];

        for (let x = 0; x < intMunkadij.length; x++) {
            munkadij_lista.push(intMunkadij[x].munkadij.valueOf());
        }

        //console.log(munkadij_lista);
        const vegleges_ar = 0;

        let sum = egysegar_lista.reduce((acc, price, index) => {
            const quantity = darab_lista[index];
            return acc + price * quantity;
        }, 0);

        //console.log(sum);

        for (let y = 0; y < munkadij_lista.length; y++) {
            vegleges_ar = await Megrendelesek.updateOne({ _id: megrendeles_id }, { ar: sum + munkadij_lista[y] });
        }

        res.status(200).send(vegleges_ar);

    } catch (error) {
        res.status(500).send({ msg: error });
    }

});


function findOptimalRoute(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = new Array(rows).fill(null).map(() => new Array(cols).fill(false));
    const route = [];
  
    function dfs(i, j, direction) {
      if (i < 0 || i >= rows || j < 0 || j >= cols || visited[i][j]) {
        return false;
      }
  
      visited[i][j] = true;
  
      if (grid[i][j] === 1) {
        route.push({ i, j });
        grid[i][j] = 0; // jelölve, itt voltunk már
      }
  
      if (direction === 'right') {
        for (let k = j + 1; k < cols; k++) {
          if (grid[i][k] === 1) {
            dfs(i, k, 'down');
          }
        }
        dfs(i + 1, cols - 1, 'left');
      } else {
        for (let k = j - 1; k >= 0; k--) {
          if (grid[i][k] === 1) {
            dfs(i, k, 'up');
          }
        }
        if (i < rows - 1) {
          dfs(i + 1, 0, 'right');
        }
      }
  
      if (i === rows - 1 && j === cols - 1) {
        // keresés vége
        if (route.length > 0) {
          route.push({ i: 0, j: 0 }); // vissza a kezdőpontra
          return true;
        } else {
          return false;
        }
      }
    }
  
    dfs(0, 0, 'right');
    return route;
  }


module.exports = router;