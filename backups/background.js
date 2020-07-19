chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == 'closeTabs') closeTabs();
});

const closeTabs = () => {
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) =>
    chrome.tabs.remove(tabs.filter((tab) => !tab.active).map((tab) => tab.id))
  );
};
