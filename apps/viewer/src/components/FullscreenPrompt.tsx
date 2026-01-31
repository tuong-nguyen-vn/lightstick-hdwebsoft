import { useState, useEffect } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';
import { useWakeLock } from '../hooks/useWakeLock';

interface FullscreenPromptProps {
  onActivated?: () => void;
}

export default function FullscreenPrompt({ onActivated }: FullscreenPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const { isSupported: fullscreenSupported, isFullscreen, request: requestFullscreen } = useFullscreen();
  const { isSupported: wakeLockSupported, request: requestWakeLock } = useWakeLock();

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

  if (dismissed || isFullscreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="max-w-sm w-full bg-gray-900 rounded-2xl p-6 text-center">
        <div className="text-5xl mb-4">🎤</div>
        <h2 className="text-xl font-bold text-white mb-6">
          Sẵn sàng chưa?
        </h2>

        <button
          onClick={handleActivate}
          className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl 
                     active:scale-95 transition-transform"
        >
          Bắt Đầu
        </button>
      </div>
    </div>
  );
}
