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
    var control = document.getElementById('control');
    var control_flg = true;
    var timer;

     getSavedRefreshInterval(url, (savedInterval) => {
      if (savedInterval) {
        minitues.value = savedInterval;
      }
    });

    control.addEventListener('click',() => {
      if(control_flg){
        if(minitues.value != ""){
          saveRefreshInterval(url, minitues.value);
          clearInterval(timer);
          timer = setInterval(function(){chrome.tabs.reload();},Number(minitues.value)*1000*60)
          control_flg=false;
          control.innerHTML = "Stop"
       }else{
          console.assert(minitues, "input interval");
        }
      }else{
        minitues.value = "";
        saveRefreshInterval(url, "");
        clearInterval(timer);
        control_flg=true;
        control.innerHTML= "Start";
      }
    });
  });
});