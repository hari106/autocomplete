//Assume a local storage based caching or/and in-memory
const cache = {
    objectMap: {},
    //an hour cache
    time: 3600000,
};

function GetLocal(entry) {
    try {
        let value = window.localStorage.getItem(entry);
        if (value === null) return [];
        else {
            cache.objectMap[entry] = JSON.parse(value);
            return cache.objectMap[entry];
        } 
    }
    catch(err) {
        if (err instanceof DOMException && (err.name === 'QuotaExceededError' ||
            err.name === 'NS_ERROR_DOM_QUOTA_REACHED') && (window.localStorage && window.localStorage.length !== 0)) {
            window.localStorage.clear();
        }
        return [];
    }
}

export const InitCache = function () {
    //update startup time
    let ts = GetLocal('timestamp:entry');

    let current = Date.now();

    if (ts !== null) {
        if (Number(current) - Number(ts) > Number(cache.time)) {
            //clear cache
            window.localStorage.clear();
        }
    }

    window.localStorage['timestamp:entry'] = current;
}

export const AddToCache = (entry, list) => {

    try {
        window.localStorage[entry] = JSON.stringify(list);
    }
    catch (err) {
        if (err instanceof DOMException && (err.name === 'QuotaExceededError' ||
            err.name === 'NS_ERROR_DOM_QUOTA_REACHED') && (window.localStorage && window.localStorage.length !== 0)) {
            window.localStorage.clear();
        }
    }

    //In-memory obviously
    cache.objectMap[entry] = [...list];
}

export const GetFromCache = (entry) => {
    if (entry in cache.objectMap) {
        console.log('HIT!');
        return cache.objectMap[entry];
    } else {
        //check in localstorage
        console.log('MISS!');
        return GetLocal(entry);
    }
}