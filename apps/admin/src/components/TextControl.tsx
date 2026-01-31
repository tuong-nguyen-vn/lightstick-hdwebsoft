import { useState, useCallback, useEffect } from 'react';
import type { LightstickState } from '@lightstick/shared';
import { CONFIG, DEFAULT_COLORS, YEP_PRESET_TEXTS } from '@lightstick/shared';

interface TextControlProps {
  onApply: (state: LightstickState) => void;
  onPreview?: (state: LightstickState) => void;
  currentText?: string;
  currentSpeed?: number;
  currentColor?: string;
}

type SpeedPreset = 'slow' | 'medium' | 'fast';

interface SavedText {
  id: string;
  text: string;
  createdAt: number;
}

const SPEED_PRESETS: Record<SpeedPreset, { label: string; value: number }> = {
  slow: { label: 'Slow', value: 1000 },
  medium: { label: 'Medium', value: 3000 },
  fast: { label: 'Fast', value: 5000 },
};

const STORAGE_KEY = 'lightstick-saved-texts';

const loadSavedTexts = (): SavedText[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSavedTexts = (texts: SavedText[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
};

export default function TextControl({
  onApply,
  onPreview,
  currentText = '',
  currentSpeed = CONFIG.TEXT_SPEED_DEFAULT,
  currentColor = '#FFFFFF',
}: TextControlProps) {
  const [text, setText] = useState(currentText);
  const [speed, setSpeed] = useState(currentSpeed);
  const [textColor, setTextColor] = useState(currentColor);
  const [bgColor, setBgColor] = useState('#000000');
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);

  const triggerPreview = useCallback((newText?: string, newSpeed?: number, newTextColor?: string, newBgColor?: string) => {
    onPreview?.({
      mode: 'text',
      text: newText ?? text,
      textSpeed: newSpeed ?? speed,
      color: newTextColor ?? textColor,
      backgroundColor: newBgColor ?? bgColor,
    });
  }, [onPreview, text, speed, textColor, bgColor]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    onPreview?.({ mode: 'text', text: newText, textSpeed: speed, color: textColor, backgroundColor: bgColor });
  }, [onPreview, speed, textColor, bgColor]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    triggerPreview(undefined, newSpeed);
  }, [triggerPreview]);

  const handleTextColorChange = useCallback((newColor: string) => {
    setTextColor(newColor);
    triggerPreview(undefined, undefined, newColor);
  }, [triggerPreview]);

  const handleBgColorChange = useCallback((newColor: string) => {
    setBgColor(newColor);
    triggerPreview(undefined, undefined, undefined, newColor);
  }, [triggerPreview]);

  useEffect(() => {
    setSavedTexts(loadSavedTexts());
  }, []);

  const handleSaveText = useCallback(() => {
    if (!text.trim()) return;

    // Check if text already exists
    if (savedTexts.some(item => item.text === text.trim())) {
      return;
    }

    const newSavedText: SavedText = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: Date.now(),
    };

    const updated = [newSavedText, ...savedTexts];
    setSavedTexts(updated);
    saveSavedTexts(updated);
  }, [text, savedTexts]);

  const handleDeleteSavedText = useCallback((id: string) => {
    const updated = savedTexts.filter(item => item.id !== id);
    setSavedTexts(updated);
    saveSavedTexts(updated);
  }, [savedTexts]);

  const handleSelectSavedText = useCallback((savedText: SavedText) => {
    handleTextChange(savedText.text);
  }, [handleTextChange]);

  const getSpeedPreset = (value: number): SpeedPreset => {
    if (value >= 4000) return 'fast';
    if (value >= 2000) return 'medium';
    return 'slow';
  };

  const handleSpeedPreset = (preset: SpeedPreset) => {
    handleSpeedChange(SPEED_PRESETS[preset].value);
  };

  const handleApply = useCallback(() => {
    if (!text.trim()) return;

    onApply({
      mode: 'text',
      text: text.trim(),
      textSpeed: speed,
      color: textColor,
      backgroundColor: bgColor,
    });
  }, [onApply, text, speed, textColor, bgColor]);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        Text Mode
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-slate-400">Message Text</label>
            {text.trim() && !savedTexts.some(item => item.text === text.trim()) && (
              <button
                onClick={handleSaveText}
                className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </button>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-xs text-slate-500 mb-1">Preset texts (YEP)</label>
            <div className="flex flex-wrap gap-2">
              {YEP_PRESET_TEXTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleTextChange(preset)}
                  className="px-3 py-1.5 bg-primary-500/20 hover:bg-primary-500/40 text-primary-300 rounded-lg text-sm transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {savedTexts.length > 0 && (
            <div className="mb-3">
              <label className="block text-xs text-slate-500 mb-1">Saved texts</label>
              <div className="flex flex-wrap gap-2">
                {savedTexts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer group transition-colors"
                  >
                    <span
                      onClick={() => handleSelectSavedText(item)}
                      className="text-sm text-white"
                    >
                      {item.text.length > 20 ? item.text.slice(0, 20) + '...' : item.text}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSavedText(item.id);
                      }}
                      className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter text to display..."
            rows={2}
            maxLength={100}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">{text.length}/100 characters</p>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Scroll Speed</label>
          <div className="flex gap-2 mb-3">
            {(Object.keys(SPEED_PRESETS) as SpeedPreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => handleSpeedPreset(preset)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  getSpeedPreset(speed) === preset
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {SPEED_PRESETS[preset].label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={CONFIG.TEXT_SPEED_MIN}
            max={CONFIG.TEXT_SPEED_MAX}
            step={10}
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Slow</span>
            <span>{speed}ms</span>
            <span>Fast</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
          <label className="block text-sm text-slate-400 mb-2">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
            />
            <div className="flex flex-wrap gap-1 flex-1">
              {DEFAULT_COLORS.slice(0, 6).map((color) => (
                <button
                  key={color}
                  onClick={() => handleTextColorChange(color)}
                  className={`w-6 h-6 rounded border ${
                    textColor === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          </div>

          <div>
          <label className="block text-sm text-slate-400 mb-2">Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleBgColorChange('#000000')}
                className={`w-6 h-6 rounded border ${
                  bgColor === '#000000' ? 'border-white' : 'border-slate-600'
                } bg-black`}
              />
              <button
                onClick={() => handleBgColorChange('#1e293b')}
                className={`w-6 h-6 rounded border ${
                  bgColor === '#1e293b' ? 'border-white' : 'border-transparent'
                } bg-slate-800`}
              />
            </div>
          </div>
          </div>
        </div>

        <div
          className="h-16 rounded-lg flex items-center overflow-hidden relative"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="whitespace-nowrap text-2xl font-bold absolute"
            style={{
              color: textColor,
              animation: `marquee ${12000 / speed}s linear infinite`,
            }}
          >
            {text || 'Preview text...'}
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={!text.trim()}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Apply Text
        </button>
      </div>

      <style>{`
        @keyframes marquee {
          0% { left: 100%; }
          100% { left: -100%; }
        }
      `}</style>
    </div>
  );
}
