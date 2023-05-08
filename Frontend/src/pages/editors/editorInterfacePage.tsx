import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../slices/toastSlice';
import { setLoad } from '../../slices/loadingSlice';

function EditorInterfacePage() {

    const dispatch = useAppDispatch();
    const { userLogged, loggedIn } = useSelector((state: any) => state.authFire);

    const [userNews, setUserNews] = useState([]);
    const [userEvents, setUserEvents] = useState([]);

    useEffect(() => {
        if (userLogged.firebaseID !== '') {
            getDatas();
        }
    }, [loggedIn, userLogged.firebaseID])

    const getDatas = async () => {

        dispatch(setLoad(true));

        await axios.get(`http://localhost:3001/api/hirek/felhasznaloi/${userLogged.firebaseID}`)
            .then(response => {
                setUserNews(response.data)
            })
            .catch(error => console.log(error));

        await axios.get(`http://localhost:3001/api/esemenyek/felhasznaloi/${userLogged.firebaseID}`)
            .then(response => {
                setUserEvents(response.data)
            })
            .catch(error => console.log(error));

        dispatch(setLoad(false));
    }

    const deleteDoc = async (doc_id: string, doc_type: number) => {

        dispatch(setLoad(true));

        switch (doc_type) {
            case 0:
                await axios.delete(`http://localhost:3001/api/hirek/${doc_id}`)
                    .then(response => {
                        dispatch(showToast({ type: "success", message: "Hír törölve!" }))
                        getDatas();
                    })
                    .catch(error => {
                        console.log(error)
                        dispatch(setLoad(false));
                    });

                break;
            case 1:
                await axios.delete(`http://localhost:3001/api/esemenyek/${doc_id}`)
                    .then(response => {
                        dispatch(showToast({ type: "success", message: "Esemény törölve!" }))
                        getDatas();
                    })
                    .catch(error => {
                        console.log(error)
                        dispatch(setLoad(false));
                    });

                break;
        }

    }

    const renderNews = userNews.map((news) => {
        return (
            <div className='editor-selector-list-element' key={news['_id']}>
                <span>
                    {news['cim']}
                </span>
                {
                    userLogged.permissions?.news_edit ?
                        <Link to={`/szerkeszto/hir/modositas?id=${news['_id']}`}>
                            <button title='Hír módosítása'>
                                Μ
                            </button>
                        </Link>
                        : []
                }
                {
                    userLogged.permissions?.news_delete ?
                        <button title='Hír törlése' onClick={() => { deleteDoc(news['_id'], 0) }}>
                            ✖
                        </button>
                        : []
                }
            </div>
        );
    });

    const renderEvents = userEvents.map((event) => {
        return (
            <div className='editor-selector-list-element' key={event['_id']}>
                <span>
                    {event['megnevezes']}
                </span>
                {
                    userLogged.permissions?.events_edit ?
                        <Link to={`/szerkeszto/esemeny/modositas?id=${event['_id']}`}>
                            <button title='Esemény módosítása'>
                                Μ
                            </button>
                        </Link>
                        : []
                }
                {
                    userLogged.permissions?.events_delete ?
                        <button title='Esemény törlése' onClick={() => { deleteDoc(event['_id'], 1) }}>
                            ✖
                        </button>
                        : []
                }
            </div>
        );
    });

    return (
        <div>
            {
                userLogged.permissions?.news_create || userLogged.permissions?.events_create ?
                    <div className='editor-selector'>
                        <div>
                            {
                                userLogged.permissions?.news_create ?
                                    <Link to="/szerkeszto/hir">
                                        <button className='editor-selector-button'>
                                            Új hír létrehozása
                                        </button>
                                    </Link>
                                    : []
                            }
                        </div>
                        <div>
                            {
                                userLogged.permissions?.events_create ?
                                    <Link to="/szerkeszto/esemeny">
                                        <button className='editor-selector-button'>
                                            Új esemény létrehozása
                                        </button>
                                    </Link>
                                    : []
                            }
                        </div>
                        <div className='editor-selector-list'>
                            <div className='editor-selector-subtitle'>
                                Felhasználó hírei
                            </div>
                            <div className='editor-selector-list-container'>
                                {renderNews}
                            </div>
                        </div>
                        <div className='editor-selector-list'>
                            <div className='editor-selector-subtitle'>
                                Felhasználó eseményei
                            </div>
                            <div className='editor-selector-list-container'>
                                {renderEvents}
                            </div>
                        </div>
                    </div>
                    :
                    <div className='centered'>
                        Csak jogosultsággal!
                    </div>
            }
        </div>
    )
}

export default EditorInterfacePage