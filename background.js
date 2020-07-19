chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) =>
    chrome.tabs.remove(tabs.filter((tab) => !tab.active).map((tab) => tab.id))
  );
});
