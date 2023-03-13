import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where, getFirestore, Timestamp, DocumentReference, addDoc, serverTimestamp } from 'firebase/firestore'
import { Editor } from '@tinymce/tinymce-react';
import { blob } from 'stream/consumers';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { replaceHungarianCharsPlus } from '../../utils/UtilFunctions';

function NewsEditorPage() {

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
        isPublic: true
    })

    const [listIcon, setListIcon] = useState();

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
        isPublic: true
    })

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

        const id = (event.target.id).split('_')[2]

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
            setDoc({
                ...doc,
                [id]: event.target.checked,
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

        // Fájlok feltöltése és a képek src-jének felülírása automata
        await UploadFiles();

        // A content lekérése az editorból
        const contentT = await editorRef.current.getContent();

        // Jelenlegi idő lekérése
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

        // Feltöltés Firebase-re
        const docUploaded = await addDoc(collection(db, "news"), docUpload)

        // save visszaállítása
        setFinalDoc({
            ...finalDoc,
            canBeSaved: false
        })

        // Testing
        console.log(docUploaded.id)
    }

    return (
        <form onSubmit={SaveData}>
            <div className='row'>
                <div className='col-lg-5 col-12'>
                    <div className="input-group mt-3">
                        <span className="input-group-text">Hír címe</span>
                        <input type="text" className="form-control" id='editor_input_title' value={doc.title} onChange={changeDocParam} />
                    </div>
                </div>
                <div className='col-lg-7' />

                <div className='col-lg-3 col-12'>
                    <div className="input-group my-4">
                        <span className="input-group-text">Kategória</span>
                        <select className="form-select" id="editor_input_type" value={doc.type} onChange={changeDocParam} >
                            <option value="">Válasszon...</option>
                            <option value="egyetemi">Egyetemi</option>
                            <option value="kari">Kari</option>
                            <option value="pehok">PEHÖK</option>
                            <option value="kollegiumi">Kollégiumi</option>
                            <option value="surgos">Sűrgős</option>
                        </select>
                    </div>
                </div>
                <div className='col-lg-4 col-12'>
                    <div className="input-group my-4">
                        <span className="input-group-text">Tagek</span>
                        <input type="text" className="form-control" id='editor_input_tags' placeholder='Egymás után, vesszővel elválasztva' value={doc.tags.join() + ""} onChange={changeDocParam} />
                    </div>
                </div>
                <div className='col-lg-5' />

                <div className='col-12'>
                    <div className="input-group mb-4">
                        <span className="input-group-text">Publikus cikk?</span>
                        <div className="input-group-text">
                            <input className="form-check-input mt-0" type="checkbox" id='editor_input_isPublic' value={doc.isPublic.toString()} onChange={changeDocParam} />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
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
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            body_id: 'editorContent'
                        }}
                    />
                </div>
                {/* <div className='col-lg-4 col-12'>
                    <div className="input-group my-4">
                        <label className="input-group-text" htmlFor="editor_input_header_img">Fejléckép</label>
                        <input type="file" className="form-control" id="editor_input_header_img" />
                    </div>
                </div> */}
                <div className='col-lg-4 col-12'>
                    <div className="input-group my-4">
                        <label className="input-group-text" htmlFor="editor_input_listIcon">Listakép</label>
                        <input type="file" className="form-control" id="editor_input_listIcon" onChange={changeDocParam} />
                    </div>
                </div>
                <div className='col-lg-4' />
                <div className='col-lg-12 col-12'>
                    <button className="form-control editor-save-button" type='submit'>
                        Mentés
                    </button>
                </div>

            </div>
        </form>
    )
}

export default NewsEditorPage