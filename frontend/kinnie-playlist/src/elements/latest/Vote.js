import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { apiJson } from '../../api/apiUtil';

import default_image from '../../default_image.png';

import './Vote.css'

function Vote({ data }) {
    const navigate = useNavigate();

    const [vote_character, setCharacter] = useState(undefined);
    const [vote_song, setSong] = useState(undefined);

    useEffect(() => {
        async function getData() {
            const characterData = await apiJson('/api/characters/' + data.character_id);
            if (characterData.status === 200) {
                setCharacter(characterData.response);
            }
            const songData = await apiJson('/api/songs/' + data.song_id);
            if (songData.status === 200) {
                setSong(songData.response);
            }
        }

        getData();

    }, [data]);

    return (<>
        {
            vote_character != null && vote_song != null ?
                <div className="Vote">
                    <div className="Vote-image-container">
                        <img className="Vote-image" src={vote_character.img_file} alt={vote_character.name}
                            onError={(image) => {
                                image.target.onerror = null;
                                image.target.src = default_image;
                            }} />
                        <img className="Vote-image" src={vote_song.img_file}
                            alt={vote_song.title}
                            onError={(image) => {
                                image.target.onerror = null;
                                image.target.src = default_image;
                            }} />
                    </div>
                    <div className="Vote-info-container">
                        Someone voted <b>{vote_song.title}</b> by {vote_song.artists} as the theme for&nbsp;
                        <button className="Vote-button" onClick={() => navigate("/character/" + vote_character.character_id)}>
                            {vote_character.name}
                        </button>!
                    </div>
                </div>
                : <></>
        }
    </>
    );
}

export default Vote