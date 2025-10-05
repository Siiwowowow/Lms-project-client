// src/hooks/useProtectContent.js
import { useEffect } from 'react';

export const useProtectContent = () => {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (event) => {
      event.preventDefault();
      // Optional: Show alert message
      // alert('Right click is disabled!');
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (event) => {
      if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && event.key === 'I') ||
        (event.ctrlKey && event.shiftKey && event.key === 'J') ||
        (event.ctrlKey && event.key === 'u')
      ) {
        event.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};