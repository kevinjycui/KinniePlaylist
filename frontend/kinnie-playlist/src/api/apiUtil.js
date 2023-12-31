export async function apiJson(path, method = 'GET', body = null) {
    var payload = {
        headers: {
            "Content-Type": "application/json"
        },
        method: method
    }

    if (body !== null) {
        payload.body = body;
    }

    const response = await fetch(path, payload);
    const json = await response.json();
    if (response.status >= 400) {
        console.error(json.message);
        return {
            "status": response.status
        };
    }

    return {
        "status": 200,
        "response": json
    };
}

async function spotifyRefreshToken(setToken, refreshToken) {
    const refresh_response = await fetch('/auth/refresh?refresh_token=' + refreshToken);
    const refresh_json = await refresh_response.json();
    if (refresh_response.status >= 400) {
        console.error(refresh_json.message);
        return {
            "status": refresh_response.status
        };
    }

    const now = new Date();
    localStorage.setItem('kinnie-access-token', JSON.stringify(
        {
            value: refresh_json.access_token,
            expiry: now.getTime() + (refresh_json.expires_in ?? 3600) * 1000
        }))

    setToken(refresh_json.access_token);

    return {
        "status": refresh_response.status,
        "token": refresh_json.access_token
    };
}

export async function spotifyCheckRefreshToken(setToken, refreshToken) {
    const localTokenData = localStorage.getItem('kinnie-access-token');
    if (localTokenData === null) {
        if (refreshToken !== '') {
            spotifyRefreshToken(setToken, refreshToken);
        }
        else {
            return;
        }
    }

    else {
        const data = JSON.parse(localTokenData);
        const now = new Date();
        if (data.expiry !== null && data.expiry <= now.getTime()) {
            localStorage.removeItem('kinnie-access-token');
            if (refreshToken !== '') {
                spotifyRefreshToken(setToken, refreshToken);
            }
            else {
                setToken('');
            }
            return;
        }

        else {
            setToken(data.value);
        }
    }
}

export async function spotifyApiJson(path, token, setToken, refreshToken, method = 'GET', body = null, refresh_if_failure = false) {
    var payload = {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: method
    }

    if (body !== null) {
        payload.body = body;
    }

    const spotify_response = await fetch('https://api.spotify.com/v1/' + path, payload);

    const spotify_json = await spotify_response.json();

    if (spotify_response.status === 400 && refresh_if_failure) {
        const refreshData = await spotifyCheckRefreshToken(setToken, refreshToken)
        if (refreshData.status >= 400) {
            return refreshData;
        }
        return spotifyApiJson(path, refreshData.token, setToken, refreshToken, method, body, refresh_if_failure = false);
    }
    else if (spotify_response.status >= 400) {
        if (spotify_response.status === 429) {
            alert("Too many requests. Please wait a bit and then try again.")
        }
        console.error(await spotify_response.text());
        return {
            "status": spotify_response.status
        };
    }

    return {
        "status": spotify_response.status,
        "response": spotify_json
    };
}


export async function spotifyApi(path, token, setToken, refreshToken, method = 'GET', body = null, refresh_if_failure = false) {
    var payload = {
        headers: {
            "Authorization": "Bearer " + token,
        },
        method: method
    }

    if (body !== null) {
        payload.body = body;
    }

    const spotify_response = await fetch('https://api.spotify.com/v1/' + path, payload);

    if (spotify_response.status === 400 && refresh_if_failure) {
        const refreshData = await spotifyCheckRefreshToken(setToken, refreshToken);
        if (refreshData.status >= 400) {
            return refreshData;
        }
        return spotifyApi(path, refreshData.token, setToken, refreshToken, method, body, refresh_if_failure = false);
    }
    else if (spotify_response.status >= 400) {
        if (spotify_response.status === 429) {
            alert("Too many requests. Please wait a bit and then try again.")
        }
        console.error(await spotify_response.text());
        return {
            "status": spotify_response.status
        };
    }

    return {
        "status": spotify_response.status
    };
}



