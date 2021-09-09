const cache = {
    cacheTimer: 86400000,
    objectMap: {}
};

export const AddToCache = (entry, list) => {
    cache.objectMap[entry] = [...list];
}

export const GetFromCache = (entry) => {
    if(entry in cache.objectMap) {
        return cache.objectMap[entry];
    } else {
        return [];
    }
}