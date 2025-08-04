$(document).ready(function () {
  /** @type {HTMLDivElement} */
  const searchPanel = document.getElementById('search-panel');
  if (!searchPanel) {
    console.warn('[search-panel:init] No search panel node found');
    debugger;
    return;
  }
  /** @type {HTMLDivElement} */
  const searchPanelContainer = searchPanel.querySelector('.container');
  if (!searchPanelContainer) {
    console.warn('[search-panel:init] No search panel container found');
    debugger;
    return;
  }

  /** @type {boolean} */
  let isVisible = searchPanel.classList.contains('visible');

  /** @type {string} */
  let searchValue = '';

  /** @type {HTMLFormElement} */
  const triggerForm = document.getElementById('search-panel-trigger');
  if (!triggerForm) {
    console.warn('[search-panel:init] No search panel trigger form found');
    debugger;
    return;
  }

  /** @type HTMLInputElement */
  const panelInput = searchPanel.querySelector('#search-panel-input');
  if (!panelInput) {
    console.warn('[search-panel:init] No search panel input field found');
    debugger;
    return;
  }

  /** @type HTMLInputElement */
  const bodyInput = triggerForm.querySelector('input[name="q"]');
  if (!panelInput) {
    console.warn('[search-panel:init] No body form input field found');
    debugger;
    return;
  }

  /// Routines...

  function closePanel() {
    if (isVisible) {
      isVisible = false;
      updatePanelStatus();
    }
  }

  /** Close the panel if the Escape key clicked
   * @param {KeyboardEvent} ev
   */
  function detectEsc(ev) {
    if (ev.key === 'Escape') {
      closePanel();
    }
  }

  /** Prevent close the panel if it's been clicked inside
   * @param {MouseEvent} ev
   */
  function preventClose(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    // console.log('[search-panel:preventClose]', ev);
  }

  /** Close the panel by click outside the panel (see `preventClose` method above)
   * @param {MouseEvent} _ev
   */
  function closeByClick(_ev) {
    // console.log('[search-panel:closeByClick]', _ev);
    closePanel();
  }

  function goToResults() {
    triggerForm.submit();
  }

  /** @param {string} str
   * @return {string}
   */
  function escapeHtmlString(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function updateSearchValueInDocument() {
    const escapedValue = escapeHtmlString(searchValue);
    bodyInput.value = escapedValue;
    panelInput.value = escapedValue;
  }

  function updatePanelStatus() {
    updateSearchValueInDocument();
    searchPanel.classList.toggle('visible', !!isVisible);
    // Set/reset event handlers
    if (isVisible) {
      searchPanelContainer.addEventListener('mouseup', preventClose, true);
      document.addEventListener('mouseup', closeByClick);
      document.addEventListener('keydown', detectEsc);
    } else {
      searchPanelContainer.addEventListener('mouseup', preventClose);
      document.removeEventListener('mouseup', closeByClick);
      document.removeEventListener('keydown', detectEsc);
    }
    // Focus in the input field
    if (isVisible) {
      setTimeout(() => panelInput.focus(), 100);
      // DEBUG: Show and hide the loading spinner
      searchPanel.classList.toggle('loading', true);
      setTimeout(() => searchPanel.classList.toggle('loading', false), 1000);
    }
  }

  /** @param {MouseEvent} ev */
  function onTriggerClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('[search-panel:onTriggerClick]', {
      ev,
    });
    isVisible = !isVisible;
    updatePanelStatus();
  }

  function init() {
    const closeButton = searchPanel.querySelector('#close-button');
    const goToResultsButton = searchPanel.querySelector('#go-to-results');
    const searchPanelButtonButton = searchPanel.querySelector('#search-panel-button');

    const urlParams = new URLSearchParams(window.location.search);
    searchValue = urlParams.get('q') || '';

    console.log('[search-panel:init]', {
      searchValue,
      isVisible,
      panelInput,
      triggerForm,
      closeButton,
      goToResultsButton,
    });

    triggerForm.addEventListener('click', onTriggerClick);
    closeButton && closeButton.addEventListener('click', closePanel);
    goToResultsButton && goToResultsButton.addEventListener('click', goToResults);
    searchPanelButtonButton && searchPanelButtonButton.addEventListener('click', goToResults);

    if (isVisible) {
      updatePanelStatus();
    } else {
      updateSearchValueInDocument();
    }
  }

  init();
});
