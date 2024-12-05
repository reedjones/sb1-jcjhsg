import React, { useEffect } from 'react';
import { FileTree } from './FileTree';
import { Eye, EyeOff } from 'lucide-react';
import { useFileSystemStore } from '../store/fileSystemStore';
import { sendMessage } from '../storage/chromeExtension/messages';

export function Popup() {
  const { isVisible, setVisible, setNodes, currentUrl, setCurrentUrl } = useFileSystemStore();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0].url;
      if (url) {
        setCurrentUrl(url);
        const response = await sendMessage({
          type: 'GET_NODES',
          payload: { url },
        });
        if (response.success && response.data) {
          setNodes(response.data);
        }
      }
    });
  }, []);

  return (
    <div className="w-96 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Code Snippets</h1>
        <button
          onClick={() => setVisible(!isVisible)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title={isVisible ? 'Hide File Manager' : 'Show File Manager'}
        >
          {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <FileTree />
    </div>
  );
}