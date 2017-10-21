function getCurrentTabUrl(callback) {
   var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}
/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedRefreshInterval(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveRefreshInterval(url, interval) {
  var items = {};
  items[url] = interval;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var minitues = document.getElementById('minitues');
    var start = document.getElementById('start');

     getSavedRefreshInterval(url, (savedInterval) => {
      if (savedInterval) {
        minitues.value = savedInterval;
        reloadTab(minitues.value);
      }
    });

    start.addEventListener('click',() => {
      if(minitues.value){
        saveRefreshInterval(url, minitues.value);
        reloadTab(minitues.value);
      }else{
        console.assert(minitues, "input interval");
      }
    });
  });
});

function reloadTab(interval){
  setInterval(function(){chrome.tabs.reload();}, Number(interval)*1000*5);
}
