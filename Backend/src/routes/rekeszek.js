const { Router, response } = require('express');
const router = Router();

const Rekeszek = require('../database/schemas/Rekesz')
const Alkatreszek = require('../database/schemas/Alkatresz');
const Anyagigenyek = require('../database/schemas/Anyagigenyek');
const utils = require('../utils')

router.get('/', async (req, res) => {

    try {

        const rekesz_lista = await Rekeszek.find()

        res.send(rekesz_lista)

    }
    catch (error) {
        res.send({ msg: error })
    }

})

router.get('/foglaltLista', async (req, res) => {

    try {

        const foglaltLista = await foglaltHelyek()

        res.send(foglaltLista)

    }
    catch (error) {
        res.send({ msg: error })
    }

})

const foglaltHelyek = async () => {
    const rekesz_lista = await Rekeszek.find({}, 'elhelyezkedes -_id')

    let foglaltHelyek = []

    for (let x = 0; x < rekesz_lista.length; x++) {
        foglaltHelyek.push(rekesz_lista[x].elhelyezkedes.toString())
    }

    return foglaltHelyek
}

router.get('/tarolt_alkatreszek', async (req, res) => {

    try {

        const tarolt_alkatreszek = await Rekeszek.find();

        let alkatresz_idk = [];

        tarolt_alkatreszek.forEach(tarolo => {
            if (!alkatresz_idk.includes(tarolo.tarolt_alkatresz)) {
                alkatresz_idk.push(tarolo.tarolt_alkatresz);
            }
        });

        const alkatresz_objektumok = await Alkatreszek.find({ _id: { $in: alkatresz_idk } })

        res.status(200).send(alkatresz_objektumok);

    } catch (error) {
        res.send({ msg: error });
    }
});

router.get('/szabadok', async (req, res) => {

    try {

        const maxRekeszSzam = 10 * 4 * 6;

        const rekesz_lista = await Rekeszek.find()

        const rekesz_helyek = [];

        for (var x = 0; x < rekesz_lista.length; x++) {

            rekesz_helyek[x] = " [" + rekesz_lista[x].elhelyezkedes + "] "

        }

        const szabadRekeszek = maxRekeszSzam - rekesz_lista.length;

        res.send({ msg: `Szabad rekeszek száma: ${szabadRekeszek} (max: ${maxRekeszSzam}). Elfoglalt helyek: ${rekesz_helyek}` });

    }
    catch (e) {
        res.send({ msg: e })
    }

})

// RÉGI : Itt statikus a hely
router.post('/feltolt', async (req, res) => {

    const { elhelyezkedes, tarolt_alkatresz } = req.body;

    try {

        // Létezik-e az alkatrész?
        const alkatresz = await Alkatreszek.findById({ _id: tarolt_alkatresz })

        //console.log("Hello " + alkatresz.nev)

        if (alkatresz === null) {
            res.send({ msg: "HIBA: A megadott ID-vel nem található Alkatrész" });
            return;
        }

        // Ha igen, akkor jó-e az elhelyezés formátuma?

        const elhelyezesTomb = elhelyezkedes.split(",");

        if (elhelyezesTomb.length !== 3) {
            res.send({ msg: "HIBA: Az elhelyezkedés formátuma hibás" });
            return;
        }

        const helyTomb = [parseInt(elhelyezesTomb[0]), parseInt(elhelyezesTomb[1]), parseInt(elhelyezesTomb[2])];

        if (helyTomb[0] < 1 || helyTomb[0] > 10 ||
            helyTomb[1] < 1 || helyTomb[1] > 4 ||
            helyTomb[2] < 1 || helyTomb[2] > 6) {
            res.send({ msg: "HIBA: Az elhelyezkedés valamely értéke kívül esik a raktár méretén" });
            return;
        }

        // Ha az is megfelel, akkor meg kell nézni, hogy van-e már ott valami más

        const azonos_helyuek = await Rekeszek.find({ elhelyezkedes: helyTomb })

        if (azonos_helyuek.length > 0) {
            res.send({ msg: "HIBA: A megadott polcon már van alkatrész" })
            return;
        }

        const ujRekesz = await Rekeszek.create(
            {
                elhelyezkedes: helyTomb,
                tarolt_alkatresz: tarolt_alkatresz,
                darab: alkatresz.rekesz_max
            });

        res.status(201).send({ msg: 'Rekeszhez hozzárendelve!' })

    }
    catch (error) {
        res.send({ msg: error })
    }

})

router.post('/felvetel', async (req, res) => {

    const { beerkezo_alkatresz, beerkezo_mennyiseg } = req.body;

    try {

        // Átváltások
        let beerkezo_mennyiseg_int = parseInt(beerkezo_mennyiseg);

        // Alkatrész megkeresése
        const alkatresz = await Alkatreszek.findById(beerkezo_alkatresz);
        const rekeszMax = alkatresz.rekesz_max;

        // Megnézni, hogy mennyi fér el a jelenlegi rekeszekben
        const azonos_termeku_rekeszek = await Rekeszek.find({ tarolt_alkatresz: beerkezo_alkatresz });

        let nem_teli_rekeszek = []
        let feltoltheto_darab = 0;

        for (let x = 0; x < azonos_termeku_rekeszek.length; x++) {

            if (azonos_termeku_rekeszek[x].darab < rekeszMax) {
                nem_teli_rekeszek.push(azonos_termeku_rekeszek[x])
                feltoltheto_darab += rekeszMax - azonos_termeku_rekeszek[x].darab
            }
        }

        //console.log("Ennyi hely feltölthető létező rekeszbe: " + feltoltheto_darab);

        // Megnézni, hogy van-e még (ha kell) annyi szabad rekesz
        let feltoltes_utani_mennyiseg = beerkezo_mennyiseg_int - feltoltheto_darab

        if (feltoltes_utani_mennyiseg > 0) {
            const maradek = feltoltes_utani_mennyiseg % rekeszMax
            const szukseges_uj_rekeszszam = (feltoltes_utani_mennyiseg - maradek) / rekeszMax + (maradek > 0 ? 1 : 0)

            const szabad = await szabadRekeszekSzama();

            if (szabad < szukseges_uj_rekeszszam) {
                res.send({ msg: "HIBA: Nincs elég szabad rekesz hátra a raktárban!" })
                return;
            }
        }

        //console.log("Feltöltés után: " + feltoltes_utani_mennyiseg);

        // Létező rekeszekbe töltés
        let szamlaloA = 0;

        while (beerkezo_mennyiseg_int > 0 && szamlaloA < nem_teli_rekeszek.length) {

            let feltolt = 0;

            if (beerkezo_mennyiseg_int - (rekeszMax - nem_teli_rekeszek[szamlaloA].darab) >= 0) feltolt = rekeszMax
            else feltolt = nem_teli_rekeszek[szamlaloA].darab + beerkezo_mennyiseg_int

            //console.log("Ennyi lesz itt: " + nem_teli_rekeszek[szamlaloA].darab + " > " + feltolt)
            await Rekeszek.updateOne({ _id: nem_teli_rekeszek[szamlaloA]._id }, { darab: feltolt });

            beerkezo_mennyiseg_int -= (rekeszMax - nem_teli_rekeszek[szamlaloA].darab);
            if (beerkezo_mennyiseg_int < 0) beerkezo_mennyiseg_int = 0;

            szamlaloA++;
        }

        //console.log("Hátravan ennyi elhelyezése: " + beerkezo_mennyiseg_int);

        // Új rekeszek létrehozása
        if (beerkezo_mennyiseg_int > 0) {
            let j_sor = 1, j_oszlop = 1, j_polc = 1;

            const foglaltLista = await foglaltHelyek();

            while (beerkezo_mennyiseg_int > 0 && j_sor < 11) {

                const most_ellenorzott_hely = [j_sor, j_oszlop, j_polc]

                if (!foglaltLista.includes(most_ellenorzott_hely.toString())) {

                    // Feltöltés
                    const feltoltesi_mennyiseg = (beerkezo_mennyiseg_int > rekeszMax) ? rekeszMax : (beerkezo_mennyiseg_int % rekeszMax)

                    const ujRekesz = await Rekeszek.create(
                        {
                            elhelyezkedes: most_ellenorzott_hely,
                            tarolt_alkatresz: beerkezo_alkatresz,
                            darab: feltoltesi_mennyiseg
                        });

                    beerkezo_mennyiseg_int -= rekeszMax;
                    //console.log(most_ellenorzott_hely + " - Jó - " + beerkezo_mennyiseg_int + " (most: " + feltoltesi_mennyiseg + ")")
                }
                else {
                    //console.log(most_ellenorzott_hely + " - Nem Jó - " + beerkezo_mennyiseg_int)
                }

                // Értékek emelése
                j_polc++

                if (j_polc > 6) {
                    j_oszlop++
                    j_polc = 1;
                }
                if (j_oszlop > 4) {
                    j_sor++
                    j_oszlop = 1
                }
            }
        }

        // Anyagigények, amik azonos terméküek ÉS nem lettek még lefoglalva
        const azonos_termeku_nem_lefoglalt_igenyek = await Anyagigenyek.find({ alkatresz: beerkezo_alkatresz, allapot: 0 });

        //console.log("Igények: " + azonos_termeku_nem_lefoglalt_igenyek.length);

        // Lefoglalható darabszám meghatározása (!!!let változó)
        let elerheto_darab = await utils.ElerhetoDarabLekeres(beerkezo_alkatresz);

        // Lehetséges anyagigények lefoglalása
        let lefoglalt_igenyek = 0;

        let szamlalo = 0;

        //console.log("Kezdés: " + elerheto_darab)

        while (szamlalo < azonos_termeku_nem_lefoglalt_igenyek.length && elerheto_darab > 0) {

            // Megnézzük, hogy az igényt ki tudjuk-e elégíteni
            if (azonos_termeku_nem_lefoglalt_igenyek[szamlalo].darab <= elerheto_darab) {

                // Ha igen, akkor lefoglaljuk az alkatrészeket => igény állapot frissül + a darab változonk csökken
                azonos_termeku_nem_lefoglalt_igenyek[szamlalo].allapot = 1;
                azonos_termeku_nem_lefoglalt_igenyek[szamlalo].save();

                elerheto_darab -= azonos_termeku_nem_lefoglalt_igenyek[szamlalo].darab;

                // Növeljük a lefoglalást jelző számlálót
                lefoglalt_igenyek++;
            }

            // Számláló növelés
            szamlalo++;
        }

        //console.log("Siker");

        res.status(201).send({ msg: `Rekesz(ek)be töltve! Anyagigények száma, melyek lefoglalásra kerültek: ${lefoglalt_igenyek}` })

        // res.send("Szükséges rekeszszám: " + szukseges_rekeszszam +
        //     "\n Szabad rekeszszám: " + szabad +
        //     "\n Azonos alkatrészt tartalmazó rekeszek: " + azonos_termeku_rekeszek.length +
        //     "\n Ezekből nem teli: " + nem_teli_rekeszek.length +
        //     "\n És azokban még elfér: " + feltoltheto_darab +
        //     "\n Így csak ennyi ÚJ rekeszre van szükség: " + szukseges_uj_rekeszszam);

    }
    catch (e) {
        res.send({ msg: e })
    }

})

const szabadRekeszekSzama = async () => {

    const maxRekeszSzam = 10 * 4 * 6;

    const rekesz_lista = await Rekeszek.find()

    const rekesz_helyek = [];

    for (var x = 0; x < rekesz_lista.length; x++) {

        rekesz_helyek[x] = " [" + rekesz_lista[x].elhelyezkedes + "] "

    }

    const szabadRekeszek = maxRekeszSzam - rekesz_lista.length;


    return szabadRekeszek;
}

const foglaltRekeszekLista = async () => {
    const rekesz_lista = await Rekeszek.find()

    const rekesz_helyek = [];

    for (var x = 0; x < rekesz_lista.length; x++) {

        rekesz_helyek[x] = " [" + rekesz_lista[x].elhelyezkedes + "] "

    }
}

module.exports = router