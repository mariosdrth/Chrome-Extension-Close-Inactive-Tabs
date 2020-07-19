document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('close-tabs')
    .addEventListener('click', () =>
      chrome.runtime.sendMessage({ msg: 'closeTabs' })
    );
});
