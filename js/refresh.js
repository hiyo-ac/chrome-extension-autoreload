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

function getSavedRefreshInterval(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveRefreshInterval(url, interval) {
  var items = {};
  items[url] = interval;
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
  setInterval(function(){chrome.tabs.reload();}, Number(interval)*1000*60);
}
