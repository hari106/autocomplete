import { AddToCache, GetFromCache, InitCache } from "./caching";
//This guy will fetch results and put it into a JSON response

//states are not to be confused with http but fetch behavior results
export const FStates = {
  ERR: "-1",
  OK: "0",
};

export function InitAndClearCache() {
  InitCache();
}

function Fetch(query, callback) {
  fetch(`https://api.github.com/search/users?q=${query}&per_page=100`, {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.github.v3+json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      if ("message" in jsonResponse) {
        callback(FStates.ERR, jsonResponse["message"]);
      } else {
        //fill up user info
        AddToCache(query, jsonResponse["items"]);
        callback(FStates.OK, jsonResponse["items"]);
      }
    })
    .catch((error) => {
      callback(FStates.ERR, error);
    });
}

export function FetchGitUsers(query, callback) {
  let cachedRes = GetFromCache(query);

  if (cachedRes.length > 0) {
    callback(FStates.OK, cachedRes);
  } else {
    Fetch(query, callback);
  }
}
