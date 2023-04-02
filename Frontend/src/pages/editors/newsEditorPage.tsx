import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where, getFirestore, Timestamp, DocumentReference, addDoc, serverTimestamp } from 'firebase/firestore'
import { Editor } from '@tinymce/tinymce-react';
import { blob } from 'stream/consumers';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { replaceHungarianCharsPlus } from '../../utils/UtilFunctions';
import { useAppDispatch } from '../../store';
import { setLoad } from '../../slices/loadingSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { showToast } from '../../slices/toastSlice';
import { useNavigate } from 'react-router-dom';
import { FormatPart } from '../../utils/DateFormatting';

function NewsEditorPage() {

    // teszt
    const optionsT = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    const dispatch = useAppDispatch();
    const { userLogged } = useSelector((state: any) => state.authFire);

    const navigate = useNavigate();

    const editorRef = useRef(null);
    const storage = getStorage();
    const db = getFirestore();

    const [doc, setDoc] = useState({
        title: "",
        creationDate: null,
        creationID: "",
        creator: null,
        //headerIcon: "",
        tags: [""],
        content: "",
        type: "",
        isPublic: true,
        creator_officials: false,
    })

    const [listIcon, setListIcon] = useState();
    const [userOfficials, setUserOfficials] = useState("");

    const [finalDoc, setFinalDoc] = useState({
        canBeSaved: false,
        title: "",
        creationDate: null,
        creationID: "",
        creator: null,
        //headerIcon: "",
        listIcon: "",
        tags: [""],
        content: "",
        type: "",
        isPublic: true,
        creator_officials: false
    })

    useEffect(() => {

        if (userLogged.firebaseID === "" || !userLogged.permissions?.news_create) {

            console.log("Nincs engedély, átirányítás")

            navigate("/hiba");
        }

        getUserOfficials()
    }, [userLogged])

    const getUserOfficials = async () => {

        if (userLogged.firebaseID !== "")
            await axios.get(`http://localhost:3001/api/felhasznalok/firebase/${userLogged.firebaseID}`)
                .then(response => {
                    setUserOfficials(response.data.szervezet)
                    console.log(response.data)
                })
                .catch(error => console.log(error));

    }

    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    async function BlobFileUploadHandler(blobInfo, progress) {

        // Referencia a kép helyére előre
        const storageRef = ref(storage, `uploads/${blobInfo.filename()}`);

        // Feltöltés és egy elérési link kérése
        await uploadBytes(storageRef, blobInfo.blob());
        var url = await getDownloadURL(storageRef);

        // Visszatérés
        return url;
    }

    async function FileUploadHandler(file: File, progress) {

        // Referencia a kép helyére előre
        const storageRef = ref(storage, `uploads/${file.name}`);

        // Feltöltés és egy elérési link kérése
        await uploadBytes(storageRef, file);
        var url = await getDownloadURL(storageRef);

        // Visszatérés
        return url;
    }

    const UploadFiles = async () => {

        // Az összes kép feltöltése a mentéskor
        await editorRef.current.uploadImages();

        return;
    }

    const changeDocParam = (event) => {

        let id = (event.target.id).split('_')[2]

        if (id === "listIcon") {
            setListIcon(event.target.files[0])
        }
        if (id === "tags") {
            setDoc({
                ...doc,
                [id]: event.target.value.split(','),
            })
        }
        else if (id === "isPublic") {

            //console.log(event.target.getAttribute('data-on'))

            setDoc({
                ...doc,
                isPublic: !doc.isPublic,
            })
        }
        else if (id === "szervezet") {

            //console.log(event.target.getAttribute('data-on'))

            setDoc({
                ...doc,
                creator_officials: !doc.creator_officials,
            })
        }
        else {
            setDoc({
                ...doc,
                [id]: event.target.value,
            });
        }
    };

    // Testing
    useEffect(() => {
        console.log(doc)
    }, [doc])

    // Testing
    useEffect(() => {
        console.log(listIcon)
    }, [listIcon])

    const SaveData = async (event) => {

        // Megakadályozzuk a form oldalresetjét
        event.preventDefault();

        dispatch(setLoad(true));

        // Fájlok feltöltése és a képek src-jének felülírása automata
        await UploadFiles();

        // A content lekérése az editorból
        const contentT = await editorRef.current.getContent();

        // Jelenlegi idő lekérése - UPDATE 2023.03.31 > nem kell az idő, mert a backend automata hozzárendeli
        const currentTime = new Date();

        // Az egyedi ID létrehozása
        const titleEdited = doc.title.toLowerCase().replaceAll(' ', '-')
        const dateOfToday = currentTime.toJSON().slice(0, 10)

        // Magyar karakterek (és az '?') lecserélése
        const finalID = replaceHungarianCharsPlus(`${dateOfToday}-${titleEdited}`);

        // A listakép feltöltése
        const listImgURl = await FileUploadHandler(listIcon, 0);

        // Hátralevő adatok megadása és a useEffect[finalDoc] folytatja a folyamatot
        setFinalDoc({
            ...doc,
            creationDate: serverTimestamp(),
            content: contentT,
            creationID: finalID,
            canBeSaved: true,
            listIcon: listImgURl
        });
    }

    useEffect(() => {
        if (finalDoc.canBeSaved) {
            // Testing
            console.log(finalDoc);

            UploadDocument()
        }
    }, [finalDoc])

    const UploadDocument = async () => {
        // FinalDoc átmentése másik változóba a canBeSaved nélkül
        const docUpload = { ...finalDoc };
        delete docUpload.canBeSaved

        const docUpload2 = {
            hirID: finalDoc.creationID,
            iro: userLogged.firebaseID,
            iro_szervezete: finalDoc.creator_officials,
            cim: finalDoc.title,
            tipus: finalDoc.type,
            tartalom: finalDoc.content,
            listaKepURL: finalDoc.listIcon,
            lathato: finalDoc.isPublic
        }

        // Feltöltés Firebase-re - UPDATE 2023.03.31 > MongoDB-re áttért a projekt

        // const docUploaded = await addDoc(collection(db, "news"), docUpload)
        let resp = {};

        await axios.post('http://localhost:3001/api/hirek/',
            {
                hirID: finalDoc.creationID,
                iro: userLogged.firebaseID,
                iro_szervezete: finalDoc.creator_officials ? userOfficials : '',
                cim: finalDoc.title,
                tipus: finalDoc.type,
                tartalom: finalDoc.content,
                listaKepURL: finalDoc.listIcon,
                lathato: finalDoc.isPublic,
                hozzakotott_esemeny: eventLinked
            })
            .then(response => {

                resp = { ...response.data }

                dispatch(showToast({ type: "success", message: "Hír létrehozva!" }))
            })
            .catch(error => console.log(error));

        // save visszaállítása
        setFinalDoc({
            ...finalDoc,
            canBeSaved: false
        })

        dispatch(setLoad(false));

        // Testing
        console.log(resp['_id'])
    }

    // Esemény kapcsolása

    const [eventsFound, setEventsFound] = useState([])
    const [eventLinked, setEventLinked] = useState('')

    const changeEventSearchInput = (event) => {

        //console.log(event.target.value)

        const searchSentence = event.target.value;

        if (searchSentence.length >= 3) {

            axios.get(`http://localhost:3001/api/esemenyek/szures-hirhez?kifejezes=${searchSentence}`)
                .then(response => {

                    const resp = response.data;

                    let temp = [];

                    resp.map(event => {

                        const date = new Date(event.kezdes);
                        const dateInto = `${date.getFullYear()}.${FormatPart(date.getMonth() + 1, 2, '0')}.${FormatPart(date.getDate() + 1, 2, '0')}`

                        temp.push({
                            ...event,
                            kezdes: dateInto
                        })
                    })

                    setEventsFound(temp);
                })
                .catch(error => console.log(error));

        }
        else {
            if (eventsFound.length > 0)
                setEventsFound([]);
        }

    };

    useEffect(() => {
        console.log(eventLinked)
    }, [eventLinked])

    useEffect(() => {
        console.log(eventsFound)
    }, [eventsFound])


    return (
        <form onSubmit={SaveData}>
            <div id='editor-news-properties'>
                <div className='title-text'>
                    Hír tulajdonságai
                </div>
                <div className='editor-props'>
                    <div className='editor-prop-duo'>
                        <div className='editor-prop-name'>
                            Cím
                        </div>
                        <input type="text" className="editor-prop-input" id='editor_input_title' value={doc.title} onChange={changeDocParam} />
                    </div>
                    <div className='editor-prop-duo'>
                        <div className='editor-prop-name'>
                            Kategória
                        </div>
                        <select className="editor-prop-input" id="editor_input_type" value={doc.type} onChange={changeDocParam} >
                            <option value="" hidden>- kiválasztás -</option>
                            <option value="egyetemi">Egyetemi</option>
                            <option value="kari">Kari</option>
                            <option value="pehok">PEHÖK</option>
                            <option value="kollegiumi">Kollégiumi</option>
                        </select>
                    </div>
                    <div className='editor-prop-duo'>
                        <div className='editor-prop-name'>
                            Listakép
                        </div>
                        <div className="editor-prop-input file">
                            <input type="file" className="editor-prop-file" id="editor_input_listIcon" onChange={changeDocParam} />
                        </div>
                    </div>
                    <div className='editor-prop-duo'>
                        <div className='editor-prop-name'>
                            Publikus
                        </div>
                        <div className="editor-prop-input-holder">
                            <div className='editor-prop-input button' id='editor_input_isPublic' data-on={doc.isPublic.toString()} onClick={changeDocParam}>
                                <div className='editor-prop-button-content' />
                            </div>
                        </div>
                    </div>
                    <div className='editor-prop-trio'>
                        <div className='editor-prop-name'>
                            Szervezet nevében
                        </div>
                        <div className='editor-prop-mid'>
                            {userOfficials !== "" ? userOfficials : '- ✖ -'}
                        </div>
                        <div className="editor-prop-input-holder">
                            <div className={'editor-prop-input button' + (userOfficials !== "" ? '' : ' disabled')} id='editor_input_szervezet' data-on={doc.creator_officials.toString()} onClick={changeDocParam}>
                                <div className='editor-prop-button-content' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='editor-linked-object'>
                <div className='title-text'>
                    Kapcsolódó esemény
                </div>
                <div className='editor-props'>
                    <div className='editor-prop-duo'>
                        <div className='editor-prop-name'>
                            Keresés esemény neve alapján
                        </div>
                        <input type="text" placeholder='Legalább 3 karaktert be kell írni a kereséshez' className="editor-prop-input" onChange={changeEventSearchInput} />
                    </div>
                </div>
                <div className='editor-search-results'>
                    {
                        eventsFound.map(foundOne =>
                            <div className={'editor-search-res' + (eventLinked === foundOne._id ? " selected" : "")} key={foundOne._id} onClick={() => {
                                setEventLinked(foundOne._id)
                            }}>
                                {foundOne?.megnevezes} - {foundOne?.kezdes}
                            </div>
                        )
                    }
                </div>
            </div>
            <div id='editor-container'>
                <Editor
                    apiKey='2gfoqw1gq4jutyttjibxulkixb1byvkesojj3qu083oifcqf'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue=""
                    init={{
                        height: 500,
                        menubar: true,
                        language: 'hu_HU',
                        entity_encoding: 'raw',
                        automatic_uploads: false,
                        images_upload_handler: BlobFileUploadHandler,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'autosave'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: var(--color-A-light-3); }',
                        body_id: 'editorContent'
                    }}
                />
            </div>
            <button className="form-control" id='editor-save' type='submit'>
                Mentés
            </button>
        </form>
    )
}

export default NewsEditorPage