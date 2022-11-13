"use strict";

const DataProxy = function (cacheName = "ct_cache") {
  const CACHE_NAME = cacheName;

  /**
   *
   * @param url
   * @param options
   * @returns {Promise<Response>}
   */
  const fetchData = function (url, options) {
    return fetch(url, options)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response;
      })
      .catch((e) =>
        Log(Message(MESSAGE_TYPE.error, "server", `${e.message}`).toString())
      );
  };

  /**
   *
   * @param cache
   * @param url
   * @param options
   * @returns {Promise<JSON>}
   */
  const updateCache = function (cache, url, options) {
    return new Promise((resolve) => {
      fetchData(url, options)
        .then((response) => {
          cache.put(url, response.clone());
          resolve(response);
        })
        .catch(() =>
          Log(Message(MESSAGE_TYPE.error, "server", `${e.message}`).toString())
        );
    });
  };

  /**
   *
   * @param cache
   * @param url
   * @param options
   * @returns {Promise<JSON>}
   */
  const fetchCache = function (cache, url, options) {
    return new Promise((resolve) => {
      cache.match(url).then((cacheData) => {
        if (cacheData) {
          // Log(Message(MESSAGE_TYPE.info, 'server', 'fetched from cache').toString());
          resolve(cacheData);
        } else {
          Log(Message(MESSAGE_TYPE.info, "server", "fetched").toString());
          resolve(updateCache(cache, url, options));
        }
      });
    });
  };

  /**
   *
   * @param {string} url resource locator to request data
   * @param {object} options resource locator to request data
   * @returns {*} json result
   */
  const getData = function (url, options) {
    return caches
      .open(CACHE_NAME)
      .then((cache) => fetchCache(cache, url, options))
      .then((response) => response.json());
  };

  /**
   *
   * @param {string} url resource locator to request data
   * @param {object} options resource locator to request data
   * @returns {*} json result
   */
  const postData = function (url, options) {
    return caches
      .open(CACHE_NAME)
      .then((cache) => updateCache(cache, url, options))
      .then((response) => response.json());
  };

  return { getData, postData };
};
