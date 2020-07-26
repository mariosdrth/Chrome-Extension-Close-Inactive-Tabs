const root = document.documentElement;
const ul = document.getElementById('tabs-list');
const titleForList = document.getElementById('show-tabs');
const btnForOpenTabs = document.getElementById('btn-open-tabs');
const btnForOpenTabsSelectAll = document.getElementById('btn-open-tabs-select-all');
let listOpen = false;

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('theme', (data) => checkThemeOnStart(data.theme));
  document.getElementById('theme').addEventListener('click', (event) => toggleTheme(event.target.checked));
  document.getElementById('close-tabs-all').addEventListener('click', () => {
    chrome.runtime.sendMessage({ msg: 'closeAllTabs' });
    if (listOpen) {
      toggleListForOpenTabs();
    }
  });
  document.getElementById('close-tabs-left').addEventListener('click', () => {
    chrome.runtime.sendMessage({ msg: 'closeTabsLeft' });
    if (listOpen) {
      toggleListForOpenTabs();
    }
  });
  document.getElementById('close-tabs-right').addEventListener('click', () => {
    chrome.runtime.sendMessage({ msg: 'closeTabsRight' });
    if (listOpen) {
      toggleListForOpenTabs();
    }
  });
  document.getElementById('show-tabs').addEventListener('click', () => chrome.runtime.sendMessage({ msg: 'showTabs' }, (response) => toggleListForOpenTabs(response.currentTabs)));
  document.getElementById('btn-open-tabs-select-all').addEventListener('click', () => checkAllBoxes(Array.from(document.querySelectorAll('#tabs-list>li'))));
  document.getElementById('btn-open-tabs').addEventListener('click', () => closeSelectedTabs(Array.from(document.querySelectorAll('#tabs-list>li'))));
});

const checkAllBoxes = (list) => {
  const btnSelectAll = document.getElementById('btn-open-tabs-select-all');
  list.forEach((element) => (element.firstChild.checked = !element.firstChild.checked));
  console.log(btnSelectAll.textContent);
  if (btnSelectAll.textContent.toLowerCase() === 'select all') {
    btnSelectAll.textContent = 'Deselect All';
  } else {
    btnSelectAll.textContent = 'Select All';
  }
};

const closeSelectedTabs = (list) => {
  let ids = [];
  list.filter((element) => element.firstChild.checked === true).forEach((element) => ids.push(element.id));
  chrome.runtime.sendMessage({ msg: 'closeSelectedTabs', tabsToClose: ids }, (response) => {
    if (response.result === 'OK') {
      toggleListForOpenTabs();
    }
  });
};

const toggleListForOpenTabs = (currentTabs = null) => {
  if (!listOpen) {
    updateListOpenTabs(currentTabs);
    listOpen = true;
  } else {
    titleForList.innerHTML = 'Show Open Tabs <span class="expl">(in window)</span>';
    ul.innerHTML = '';
    btnForOpenTabs.classList.toggle('add-element');
    btnForOpenTabs.classList.toggle('remove-element');
    btnForOpenTabsSelectAll.classList.toggle('add-element');
    btnForOpenTabsSelectAll.classList.toggle('remove-element');
    listOpen = false;
  }
};

const updateListOpenTabs = (currentTabs) => {
  titleForList.innerHTML = 'Hide Open Tabs <span class="expl">(in window)</span>';
  currentTabs.forEach((tab) => {
    let li = document.createElement('li');
    li.classList.add('list-item');
    li.innerHTML = `<input class="checkbox-open-tabs" type="checkbox" name="check-${tab.id}" id="check-${tab.id}" /> <img class="list-item-img" id="img-${tab.id}" src="${tab.favIconUrl || './no-icon.png'}" alt="icon"/> <a class="ul-open-tabs" id="link-${tab.id}">${tab.title}</a>`;
    li.setAttribute('id', tab.id);
    ul.appendChild(li);
  });
  btnForOpenTabs.classList.toggle('add-element');
  btnForOpenTabs.classList.toggle('remove-element');
  btnForOpenTabsSelectAll.classList.toggle('add-element');
  btnForOpenTabsSelectAll.classList.toggle('remove-element');
  Array.from(document.getElementsByClassName('ul-open-tabs')).forEach((element) =>
    element.addEventListener('click', (event) => {
      const checkbox = document.getElementById(`check-${event.target.id.split('-')[1]}`);
      checkbox.checked = !checkbox.checked;
    })
  );
  Array.from(document.getElementsByClassName('list-item-img')).forEach((element) =>
    element.addEventListener('click', (event) => {
      const checkbox = document.getElementById(`check-${event.target.id.split('-')[1]}`);
      checkbox.checked = !checkbox.checked;
    })
  );
};

const checkThemeOnStart = (theme) => {
  if (theme === 'light') {
    root.style.setProperty('--main-back-color', '#fcfcfc');
    root.style.setProperty('--main-color', '#313131');
    document.getElementById('theme').checked = false;
  } else {
    root.style.setProperty('--main-back-color', '#313131');
    root.style.setProperty('--main-color', '#fcfcfc');
    document.getElementById('theme').checked = true;
  }
};

const toggleTheme = (dark) => {
  if (dark) {
    root.style.setProperty('--main-back-color', '#313131');
    root.style.setProperty('--main-color', '#fcfcfc');
    chrome.storage.sync.set({ theme: 'dark' });
  } else {
    root.style.setProperty('--main-back-color', '#fcfcfc');
    root.style.setProperty('--main-color', '#313131');
    chrome.storage.sync.set({ theme: 'light' });
  }
};
