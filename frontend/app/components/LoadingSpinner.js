// Loading animation component with terminal-style design
'use client';
import { useState, useEffect } from 'react';

const loadingAnimation = `
  @keyframes loading {
    0% { width: 0; }
    50% { width: 100%; }
    100% { width: 0; }
  }
`;

export default function LoadingSpinner() {
  const [initText, setInitText] = useState('');
  const [loadText, setLoadText] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const initMessage = 'Initializing news feed...';
  const loadMessage = 'Loading articles...';

  useEffect(() => {
    let currentIndex = 0;
    // First animation: Type out initialization message
    const initInterval = setInterval(() => {
      if (currentIndex < initMessage.length) {
        setInitText(prev => prev + initMessage[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(initInterval);
        // Start second animation after 1 second
        setTimeout(() => {
          setLoadText(''); // Reset loadText
          currentIndex = 0;
          const loadInterval = setInterval(() => {
            if (currentIndex < loadMessage.length) {
              setLoadText(prev => prev + loadMessage[currentIndex]);
              currentIndex++;
            } else {
              clearInterval(loadInterval);
              setShowLoader(true);
            }
          }, 50);
        }, 1000);
      }
    }, 10);

    return () => clearInterval(initInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <style>{loadingAnimation}</style>
      <div className="font-mono text-lg space-y-2">
        <div>{`>`} {initText}</div>
        {loadText && (
          <div className="flex items-center">
            <span>{`>`} {loadText} </span>
            {showLoader && (
              <div className="inline-block w-40 h-4 ml-2 bg-gray-200">
                <div 
                  className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]" 
                  style={{ animation: 'loading 2s ease-in-out infinite' }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}