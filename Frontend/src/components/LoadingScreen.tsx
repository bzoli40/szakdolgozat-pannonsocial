import React from 'react'
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';

function LoadingScreen() {

    const dispatch = useAppDispatch();
    const { load } = useSelector((state: any) => state.loading);

    return (
        <div>
            {
                load ?
                    <div className='shadow-background z-700'>
                        <div className='loading' />
                    </div>
                    : []
            }
        </div>
    )
}

export default LoadingScreen