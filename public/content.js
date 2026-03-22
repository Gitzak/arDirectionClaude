(() => {
  const STORAGE_KEY = "claudeRtlEnabled";
  const MARKDOWN_BLOCK_SELECTOR = "div.standard-markdown";
  const APPLY_CLASS = "claude-rtl-response";
  const ARABIC_PATTERN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const MANAGED_RTL_ATTR = "data-claude-rtl-managed";

  let enabled = false;
  let frameQueued = false;
  let observer;

  function hasArabic(text) {
    return ARABIC_PATTERN.test(text ?? "");
  }

  function applyManagedRtl(node) {
    node.style.setProperty("direction", "rtl", "important");
    node.style.setProperty("text-align", "right", "important");
    node.style.setProperty("unicode-bidi", "plaintext", "important");
    node.setAttribute("dir", "rtl");
    node.setAttribute(MANAGED_RTL_ATTR, "1");
  }

  function clearManagedRtl(node) {
    if (!node.hasAttribute(MANAGED_RTL_ATTR)) return;
    node.style.removeProperty("direction");
    node.style.removeProperty("text-align");
    node.style.removeProperty("unicode-bidi");
    node.removeAttribute("dir");
    node.removeAttribute(MANAGED_RTL_ATTR);
  }

  function applyToBlock(block) {
    const shouldApply = enabled && hasArabic(block.textContent);
    block.classList.toggle(APPLY_CLASS, shouldApply);

    if (shouldApply) {
      block.setAttribute("dir", "rtl");
      applyManagedRtl(block);
    } else {
      block.removeAttribute("dir");
      clearManagedRtl(block);
    }

    // Force RTL on all descendants, including pre/code tags.
    const allDescendants = block.querySelectorAll("*");
    allDescendants.forEach((node) => {
      if (shouldApply) {
        applyManagedRtl(node);
      } else {
        clearManagedRtl(node);
      }
    });
  }

  function applyDirection() {
    frameQueued = false;
    const blocks = document.querySelectorAll(MARKDOWN_BLOCK_SELECTOR);
    blocks.forEach(applyToBlock);
  }

  function queueApply() {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(applyDirection);
  }

  function startObserver() {
    observer = new MutationObserver(queueApply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  async function loadSetting() {
    try {
      const result = await chrome.storage.sync.get({ [STORAGE_KEY]: false });
      enabled = Boolean(result[STORAGE_KEY]);
    } catch {
      enabled = false;
    }
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes[STORAGE_KEY]) return;
    enabled = Boolean(changes[STORAGE_KEY].newValue);
    queueApply();
  });

  loadSetting().then(() => {
    queueApply();
    startObserver();
  });
})();
