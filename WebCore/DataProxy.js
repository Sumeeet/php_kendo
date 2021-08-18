'use strict'

const DataProxy = (cacheName = 'ct_cache') => {

    const CACHE_NAME = cacheName;

    /**
     *
     * @param url
     * @param options
     * @returns {Promise<Response>}
     */
    const fetchData = (url, options) => {
        return fetch(url, options)
        .then(response => {
                if (!response.ok) throw new Error(
                    `HTTP error! status: ${response.status}`);
                return response;
            })
        .catch(e => console.log(`Problem with fetch operation for resource ${url} : ${e.message}`))
    }

    /**
     *
     * @param cache
     * @param url
     * @param options
     * @returns {Promise<JSON>}
     */
    const updateCache = (cache, url, options) => {
        return new Promise((resolve, reject) => {
            fetchData(url, options)
            .then(response => {
                cache.put(url, response.clone())
                resolve(response);
            })
        });
    }

    /**
     *
     * @param cache
     * @param url
     * @param options
     * @returns {Promise<JSON>}
     */
    const fetchCache = (cache, url, options) => {
        return new Promise((resolve, reject) => {
            cache.match(url)
            .then(cacheData => {
                if (cacheData) {
                    //console.log("fetched from cache");
                    resolve(cacheData);
                }
                else {
                    //console.log("fetched from server");
                    resolve(updateCache(cache, url, options));
                }
            })
        });
    }

    /**
     *
     * @param {string} url resource locator to request data
     * @param {object} options resource locator to request data
     * @returns {*} json result
     */
    const getData = (url, options) => {
        return caches.open(CACHE_NAME)
        .then(cache => fetchCache(cache, url, options))
        .then(response => response.json())
    }

    /**
     *
     * @param {string} url resource locator to request data
     * @param {object} options resource locator to request data
     * @returns {*} json result
     */
    const postData = (url, options) => {
        return caches.open(CACHE_NAME)
        .then(cache => updateCache(cache, url, options))
        .then(response => response.json())
    }

    return { getData, postData };
}