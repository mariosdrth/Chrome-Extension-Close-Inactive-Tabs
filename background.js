chrome.commands.onCommand.addListener(function (command) {
  if (command === 'close-all-tabs') {
    closeAllTabs();
  } else if (command === 'close-tabs-left') {
    closeTabsLeft();
  } else if (command === 'close-tabs-right') {
    closeTabsRight();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'closeAllTabs') {
    closeAllTabs();
  } else if (request.msg === 'closeTabsLeft') {
    closeTabsLeft();
  } else if (request.msg === 'closeTabsRight') {
    closeTabsRight();
  } else if (request.msg === 'showTabs') {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
      sendResponse({ currentTabs: tabs });
    });
    return true;
  } else if (request.msg === 'closeSelectedTabs') {
    chrome.tabs.remove(
      request.tabsToClose.map((id) => parseInt(id)),
      () => {
        sendResponse({ result: 'OK' });
      }
    );
    return true;
  }
});

const closeAllTabs = () => {
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) =>
    chrome.tabs.remove(tabs.filter((tab) => !tab.active).map((tab) => tab.id))
  );
};

const closeTabsLeft = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabsForCurrent) => {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) =>
      chrome.tabs.remove(
        tabs.filter((tabToFilter) => tabToFilter.index < tabsForCurrent[0].index).map((tabToMap) => tabToMap.id)
      )
    );
  });
};

const closeTabsRight = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabsForCurrent) => {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) =>
      chrome.tabs.remove(
        tabs.filter((tabToFilter) => tabToFilter.index > tabsForCurrent[0].index).map((tabToMap) => tabToMap.id)
      )
    );
  });
};
