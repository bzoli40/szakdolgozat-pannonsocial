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
import { AreDaysSame, FormatPart } from '../../utils/DateFormatting';

function EventsEditorPage() {

    const dispatch = useAppDispatch();
    const { userLogged, initReadHappened } = useSelector((state: any) => state.authFire);

    const navigate = useNavigate();
    const editorRef = useRef(null);

    const [contentFromInput, setContentFromInput] = useState("");

    const [eventDoc, setEventDoc] = useState({
        megnevezes: '',
        tipus: '',
        helyszin: '',
        egynapos: false,
        oraKell: false,
        kezdes: '',
        vege: ''
    })

    let params = new URLSearchParams(window.location.search);
    let subSite = window.location.pathname;

    useEffect(() => {

        const modifyNewsID = params.get('id');

        if (subSite === '/szerkeszto/esemeny/modositas' && modifyNewsID !== null)
            loadDataForModify(modifyNewsID);

    }, [])

    const loadDataForModify = async (dataID: string) => {

        let input = null;

        // Adatok lekérése

        await axios.get(`http://localhost:3001/api/esemenyek/${dataID}`)
            .then(response => {
                console.log(response.data)
                input = { ...response.data }
            })
            .catch(error => console.log(error));

        if (input !== null) {
            console.log('Betöltés...')

            // Az egynapos jelző csekkolása
            const dateA = new Date(input['kezdes'])
            const dateB = new Date(input['vege'])

            // A doksi elemek betöltése

            setEventDoc({
                megnevezes: input['megnevezes'],
                tipus: input['tipus'],
                helyszin: input['helyszin'],
                oraKell: input['oraKell'],
                kezdes: input['kezdes'].substring(0, input['kezdes'].length - 2),
                vege: input['vege'].substring(0, input['vege'].length - 2),
                egynapos: AreDaysSame(dateA, dateB)
            })

            // Az editor szöveg betöltése

            setContentFromInput(input['leiras']);
        }
    }

    const changeEventParams = (event) => {

        let id = (event.target.id).split('_')[2]

        console.log(id + " - " + event.target.value)

        if (id === "egynapos" || id === 'oraKell') {
            setEventDoc({
                ...eventDoc,
                [id]: !eventDoc[id],
                vege: id === "egynapos" ? '' : eventDoc.vege
            })
        }
        else {
            setEventDoc({
                ...eventDoc,
                [id]: event.target.value
            })
        }
    };

    const SaveData = async (event) => {

        // Megakadályozzuk a form oldalresetjét
        event.preventDefault();

        console.log(eventDoc)

        dispatch(setLoad(true));

        // A content lekérése az editorból
        const contentT = await editorRef.current.getContent();

        // Vége idő meghatározása egynapos esemény esetén
        let dayEnd = new Date(eventDoc.vege)
        let finalEnd = dayEnd

        if (eventDoc.egynapos) {
            finalEnd = new Date(eventDoc.kezdes)
            finalEnd.setHours(dayEnd.getHours())
            finalEnd.setMinutes(dayEnd.getMinutes())
            finalEnd.setSeconds(dayEnd.getSeconds())
        }

        // Adatok feltöltéselet 
        let resp = {};

        await axios.post('http://localhost:3001/api/esemenyek/',
            {
                megnevezes: eventDoc.megnevezes,
                tipus: eventDoc.tipus,
                kezdes: eventDoc.kezdes,
                vege: finalEnd,
                oraKell: eventDoc.oraKell,
                helyszin: eventDoc.helyszin,
                leiras: contentT,
                letrehozo: userLogged.firebaseID
            })
            .then(response => {

                resp = { ...response.data }

                navigate('/szerkeszto')
                dispatch(showToast({ type: "success", message: "Esemény létrehozva!" }))
            })
            .catch(error => console.log(error));

        dispatch(setLoad(false));
    }

    const UpdateData = async (event) => {

        // Megakadályozzuk a form oldalresetjét
        event.preventDefault();

        console.log(eventDoc)

        dispatch(setLoad(true));

        // A content lekérése az editorból
        const contentT = await editorRef.current.getContent();

        // Vége idő meghatározása egynapos esemény esetén
        let dayEnd = new Date(eventDoc.vege)
        let finalEnd = dayEnd

        if (eventDoc.egynapos) {
            finalEnd = new Date(eventDoc.kezdes)
            finalEnd.setHours(dayEnd.getHours())
            finalEnd.setMinutes(dayEnd.getMinutes())
            finalEnd.setSeconds(dayEnd.getSeconds())
        }

        // Adatok feltöltéselet 
        let resp = {};

        await axios.put(`http://localhost:3001/api/esemenyek/${params.get('id')}`,
            {
                megnevezes: eventDoc.megnevezes,
                tipus: eventDoc.tipus,
                kezdes: eventDoc.kezdes,
                vege: finalEnd,
                oraKell: eventDoc.oraKell,
                helyszin: eventDoc.helyszin,
                leiras: contentT
            })
            .then(response => {

                resp = { ...response.data }

                navigate('/szerkeszto')
                dispatch(showToast({ type: "success", message: "Esemény módosítva!" }))
            })
            .catch(error => console.log(error));

        dispatch(setLoad(false));
    }

    return (
        <div>
            {
                userLogged.permissions?.events_create ?
                    <form onSubmit={subSite === '/szerkeszto/esemeny/modositas' && params.get('id') !== null ? UpdateData : SaveData}>
                        <div id='editor-news-properties'>
                            <div className='title-text'>
                                Esemény tulajdonságai
                            </div>
                            <div className='editor-props'>
                                <div className='editor-prop-duo'>
                                    <div className='editor-prop-name'>
                                        Megnevezés
                                    </div>
                                    <input type="text" className="editor-prop-input" id='editor_input_megnevezes' value={eventDoc.megnevezes} onChange={changeEventParams} />
                                </div>
                                <div className='editor-prop-duo'>
                                    <div className='editor-prop-name'>
                                        Típus
                                    </div>
                                    <select className="editor-prop-input" id="editor_input_tipus" value={eventDoc.tipus} onChange={changeEventParams} >
                                        <option value="" hidden>- kiválasztás -</option>
                                        <option value="egyetemi">Egyetemi</option>
                                        <option value="szorakozas">Szórakozás</option>
                                        <option value="szunet">Szünet</option>
                                        <option value="egyeb">Egyéb</option>
                                    </select>
                                </div>
                                <div className='editor-prop-duo'>
                                    <div className='editor-prop-name'>
                                        Helyszín
                                    </div>
                                    <input type="text" className="editor-prop-input" id='editor_input_helyszin' value={eventDoc.helyszin} onChange={changeEventParams} />
                                </div>
                                <div className='editor-prop-duo'>
                                    <div className='editor-prop-name'>
                                        Egynapos esemény?
                                    </div>
                                    <div className="editor-prop-input-holder">
                                        <div className='editor-prop-input button' id='editor_input_egynapos' data-on={eventDoc.egynapos} onClick={changeEventParams}>
                                            <div className='editor-prop-button-content' />
                                        </div>
                                    </div>
                                </div>
                                <div className='editor-prop-duo'>
                                    <div className='editor-prop-name'>
                                        Órapontos megjelenítés
                                    </div>
                                    <div className="editor-prop-input-holder">
                                        <div className='editor-prop-input button' id='editor_input_oraKell' data-on={eventDoc.oraKell} onClick={changeEventParams}>
                                            <div className='editor-prop-button-content' />
                                        </div>
                                    </div>
                                </div>
                                <div className='editor-prop-duo'>
                                    <div className='editor-prop-name'>
                                        Időpont
                                    </div>
                                    <div className='editor-prop-input-multiple-date'>
                                        <input type="datetime-local" id='editor_input_kezdes' value={eventDoc.kezdes} onChange={changeEventParams} />
                                        -
                                        <input type={eventDoc.egynapos ? "time" : "datetime-local"} id='editor_input_vege' value={eventDoc.vege} onChange={changeEventParams} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='editor-container'>
                            <Editor
                                apiKey='2gfoqw1gq4jutyttjibxulkixb1byvkesojj3qu083oifcqf'
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={contentFromInput}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    language: 'hu_HU',
                                    entity_encoding: 'raw',
                                    automatic_uploads: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
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
                            {
                                subSite === '/szerkeszto/esemeny/modositas' && params.get('id') !== null ?
                                    'Módosítás' : 'Mentés'
                            }
                        </button>
                    </form>
                    :
                    <div className='centered'>
                        Csak jogosultsággal!
                    </div>
            }
        </div>

    )
}

export default EventsEditorPage