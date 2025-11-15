(function () {
  // Capture the current <script> element early for maximum reliability
  const scriptTag = document.currentScript;
  if (!scriptTag) {
    console.error('[reply-via-email] Unable to detect current script element.');
    return;
  }

  // Constants to avoid hardcoded strings
  const POST_CLASS = 'post';
  const WRAPPER_CLASS = 'reply-via-email-wrapper';
  const BUTTON_CLASS = 'reply-via-email';
  const MAIN_SELECTOR = 'body.post main';
  const TITLE_SELECTOR = `${MAIN_SELECTOR} h1`;
  const TAGS_SELECTOR = '.tags';

  // Run function after DOM is fully ready
  function onReady(fn) {
    if (typeof document === 'undefined') return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function () {
    const body = document.body;
    // Only run on post pages
    if (!body || !body.classList.contains(POST_CLASS)) return;

    // Remove any existing instances to avoid duplicates
    document.querySelectorAll('.' + WRAPPER_CLASS).forEach(n => n.remove());

    // Extract the post title
    const h1 = document.querySelector(TITLE_SELECTOR);
    if (!h1) {
      console.error('[reply-via-email] Unable to locate the post title (<h1>).');
      return;
    }
    const title = h1.textContent.trim();

    // Required: email must be provided in data-email
    const email = scriptTag.dataset.email;
    if (!email || email.trim() === '') {
      console.error('[reply-via-email] Missing required attribute: data-email.');
      return;
    }

    // Optional: custom button text
    const buttonText = scriptTag.dataset.text && scriptTag.dataset.text.trim() !== ''
      ? scriptTag.dataset.text.trim()
      : 'Reply via email';

    // Locate the <main> container of the post
    const main = document.querySelector(MAIN_SELECTOR);
    if (!main) {
      console.error('[reply-via-email] Unable to locate <main> element for the post.');
      return;
    }

    // Create the email link
    const a = document.createElement('a');
    a.className = BUTTON_CLASS;
    a.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Re: ' + title);
    a.textContent = buttonText;

    // Wrap the button for styling and placement
    const wrapper = document.createElement('div');
    wrapper.className = WRAPPER_CLASS;
    wrapper.appendChild(a);

    // Insert before tags section if available, otherwise at the end of <main>
    const tags = main.querySelector(TAGS_SELECTOR);
    if (tags && tags.parentNode) {
      tags.parentNode.insertBefore(wrapper, tags);
    } else {
      main.appendChild(wrapper);
    }
  });
})();
