import { AddToCache, GetFromCache } from "./caching";
//This guy will fetch results and put it into a JSON response

//states are not to be confused with http but fetch behavior results
export const FStates = {
    ERR: '-1',
    OK: '0'
}

export function FetchGitUsers(query, callback) {

    let cachedRes = GetFromCache(query);

    if (cachedRes.length > 0) {
        callback(FStates.OK, cachedRes);
    } else {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/vnd.github.v3+json",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                //fill up user info
                AddToCache(query, jsonResponse['items']);
                callback(FStates.OK, jsonResponse['items']);
            })
            .catch((error) => {
                callback(FStates.ERR, error);
            });
    }

}

