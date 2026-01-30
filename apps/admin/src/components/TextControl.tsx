import { useState, useCallback } from 'react';
import type { LightstickState } from '@lightstick/shared';
import { CONFIG, DEFAULT_COLORS } from '@lightstick/shared';

interface TextControlProps {
  onApply: (state: LightstickState) => void;
  currentText?: string;
  currentSpeed?: number;
  currentColor?: string;
}

type SpeedPreset = 'slow' | 'medium' | 'fast';

const SPEED_PRESETS: Record<SpeedPreset, { label: string; value: number }> = {
  slow: { label: 'Slow', value: 400 },
  medium: { label: 'Medium', value: 200 },
  fast: { label: 'Fast', value: 80 },
};

export default function TextControl({
  onApply,
  currentText = '',
  currentSpeed = CONFIG.TEXT_SPEED_DEFAULT,
  currentColor = '#FFFFFF',
}: TextControlProps) {
  const [text, setText] = useState(currentText);
  const [speed, setSpeed] = useState(currentSpeed);
  const [textColor, setTextColor] = useState(currentColor);
  const [bgColor, setBgColor] = useState('#000000');

  const getSpeedPreset = (value: number): SpeedPreset => {
    if (value >= 300) return 'slow';
    if (value >= 150) return 'medium';
    return 'fast';
  };

  const handleSpeedPreset = (preset: SpeedPreset) => {
    setSpeed(SPEED_PRESETS[preset].value);
  };

  const handleApply = useCallback(() => {
    if (!text.trim()) return;
    
    onApply({
      mode: 'text',
      text: text.trim(),
      textSpeed: speed,
      color: textColor,
    });
  }, [onApply, text, speed, textColor]);

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
          <label className="block text-sm text-slate-400 mb-2">Message Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
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
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Fast</span>
            <span>{speed}ms</span>
            <span>Slow</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
              />
              <div className="flex flex-wrap gap-1 flex-1">
                {DEFAULT_COLORS.slice(0, 6).map((color) => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
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
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setBgColor('#000000')}
                  className={`w-6 h-6 rounded border ${
                    bgColor === '#000000' ? 'border-white' : 'border-slate-600'
                  } bg-black`}
                />
                <button
                  onClick={() => setBgColor('#1e293b')}
                  className={`w-6 h-6 rounded border ${
                    bgColor === '#1e293b' ? 'border-white' : 'border-transparent'
                  } bg-slate-800`}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-16 rounded-lg flex items-center overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="whitespace-nowrap animate-marquee text-2xl font-bold px-4"
            style={{ color: textColor }}
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
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
