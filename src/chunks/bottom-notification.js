$(document).ready(function () {
  // Found an announcement panel node in dom
  const node = document.getElementById('bottom-notification');

  // 'Already confirmed' state in the local storage
  const confirmedId = 'bottom-notification-confirmed';

  // Check if it has been confirmed already?
  const hasConfirmed = !window.localStorage || !!window.localStorage.getItem(confirmedId);
  if (hasConfirmed || !node) {
    if (node) {
      node.remove();
    }
    return;
  }

  // Show the panel
  node.classList.toggle('visible', true);
  // Set the body class
  document.body.classList.toggle('with-bottom-notification', true);

  // Fond other essential dom nodes
  const button = document.getElementById('bottom-notification-confirm');
  const footer = document.getElementById('footer');
  const wrapper = node.querySelector('.bottom-notification-wrapper');

  function updateGeometry() {
    // Update footer's bottom padding
    const nodeHeight =
      document.body.classList.contains('with-bottom-notification') && wrapper
        ? wrapper.offsetHeight
        : 0;
    footer.style.paddingBottom = nodeHeight + 'px';
  }

  function onButtonClick() {
    // Ok, confirmed. Restore the original state, remove the panel and set the local storage flag
    window.localStorage.setItem(confirmedId, 'yes');
    document.body.classList.toggle('with-bottom-notification', false);
    window.removeEventListener('resize', updateGeometry);
    node.remove();
    updateGeometry();
  }

  // Add essential events
  button.addEventListener('click', onButtonClick);
  window.addEventListener('resize', updateGeometry);

  // Initiall geometry update
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(updateGeometry);
  } else {
    setTimeout(updateGeometry, 50);
  }
});
