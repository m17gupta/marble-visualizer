// share-modal.js
document.addEventListener('DOMContentLoaded', function() {
  // Find the element we need
  const shareButton = document.querySelector('.share-button');
  const shareModal = document.querySelector('.share-modal');
  
  // Only add event listeners if elements exist
  if (shareButton && shareModal) {
    shareButton.addEventListener('click', function() {
      shareModal.classList.toggle('open');
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
      if (!shareModal.contains(event.target) && !shareButton.contains(event.target)) {
        shareModal.classList.remove('open');
      }
    });
  } else {
    console.log('Share modal elements not found in the DOM');
  }
});
