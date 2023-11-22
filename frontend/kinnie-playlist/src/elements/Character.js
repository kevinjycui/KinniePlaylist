import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Error from '../404'
import AddSong from './AddSong'
import Playlist from './Playlist';

import defaultImage from '../defaultImage.png'

import './Character.css'
import { apiJson } from '../api/apiUtil';

function Character() {
    const { character } = useParams();
    const [data, setData] = useState([]);
    const [code, setCode] = useState();

    useEffect(() => {

        async function getData() {
            const characterData = await apiJson('/api/characters/' + character);
            if (characterData.status === 200) {
                setData(characterData.response);
            }
            setCode(characterData.status);
        }

        getData();

    }, [character]);

    return <>
        {
            code === 404 ? <Error /> : <>
                <img className='Character-image' src={data.img_file} alt={data.name}
                    title={data.name + " from " + data.media}
                    onError={(image) => {
                        image.target.onerror = null;
                        image.target.src = defaultImage;
                    }}
                />
                <div className='Character-side'>
                    <div className='Character-name'>{data.name}</div>
                    <div className='Character-media'>{data.media}</div>
                    <AddSong character={character} />
                </div>
                <Playlist />
                <div className="buffer"></div>
            </>
        }
    </>
}

export default Character