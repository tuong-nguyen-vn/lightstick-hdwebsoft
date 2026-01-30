import { useState, useEffect } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';
import { useWakeLock } from '../hooks/useWakeLock';

interface FullscreenPromptProps {
  onActivated?: () => void;
}

export default function FullscreenPrompt({ onActivated }: FullscreenPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { isSupported: fullscreenSupported, isFullscreen, request: requestFullscreen } = useFullscreen();
  const { isSupported: wakeLockSupported, request: requestWakeLock } = useWakeLock();

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    if (isFullscreen || dismissed) {
      onActivated?.();
    }
  }, [isFullscreen, dismissed, onActivated]);

  const handleActivate = async () => {
    if (fullscreenSupported) {
      await requestFullscreen();
    }
    if (wakeLockSupported) {
      await requestWakeLock();
    }
    setDismissed(true);
  };

  const handleDismiss = async () => {
    if (wakeLockSupported) {
      await requestWakeLock();
    }
    setDismissed(true);
  };

  if (dismissed || isFullscreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="max-w-sm w-full bg-gray-900 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-4">📱</div>
        <h2 className="text-xl font-bold text-white mb-2">
          Ready to Light Up?
        </h2>
        
        {isIOS ? (
          <div className="text-gray-400 text-sm mb-6">
            <p className="mb-2">For the best experience on iOS:</p>
            <ol className="text-left list-decimal list-inside space-y-1">
              <li>Tap <span className="text-white">Share</span> button</li>
              <li>Select <span className="text-white">Add to Home Screen</span></li>
              <li>Open from Home Screen</li>
            </ol>
            <p className="mt-3 text-xs">Or tap below to continue in browser</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-6">
            Enable fullscreen mode for the best lightstick experience. 
            We'll also keep your screen awake.
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={handleActivate}
            className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl 
                       active:scale-95 transition-transform"
          >
            {fullscreenSupported ? 'Go Fullscreen' : 'Start'}
          </button>
          
          {!isIOS && (
            <button
              onClick={handleDismiss}
              className="w-full py-2 px-4 text-gray-500 text-sm"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
