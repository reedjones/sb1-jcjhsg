import { sendMessage } from './messages';

const initializePage = async () => {
  const url = window.location.href;
  await sendMessage({ type: 'INIT_URL', payload: { url } });
};

const observeCodeBlocks = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const codeBlocks = node.getElementsByTagName('code');
          Array.from(codeBlocks).forEach(processCodeBlock);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const processCodeBlock = async (codeBlock: HTMLElement) => {
  // Skip if already processed
  if (codeBlock.dataset.processed) return;
  codeBlock.dataset.processed = 'true';

  const content = codeBlock.textContent || '';
  const path = codeBlock.dataset.path || '';
  const name = path.split('/').pop() || 'untitled.txt';

  await sendMessage({
    type: 'ADD_CODE',
    payload: {
      url: window.location.href,
      name,
      content,
      path,
    },
  });
};

// Initialize
initializePage();
observeCodeBlocks();