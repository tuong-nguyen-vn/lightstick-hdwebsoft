import { useState, useCallback } from 'react';
import type { LightstickState } from '@lightstick/shared';
import { ICON_PRESETS, DEFAULT_COLORS } from '@lightstick/shared';

interface IconControlProps {
  onApply: (state: LightstickState) => void;
}

export default function IconControl({ onApply }: IconControlProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>(ICON_PRESETS[0]);
  const [customIcon, setCustomIcon] = useState('');
  const [bgColor, setBgColor] = useState('#000000');

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    setCustomIcon('');
  };

  const handleCustomIconChange = (value: string) => {
    setCustomIcon(value);
    if (value) {
      setSelectedIcon(value);
    }
  };

  const handleApply = useCallback(() => {
    const icon = customIcon || selectedIcon;
    if (!icon) return;

    onApply({
      mode: 'icon',
      icon,
      backgroundColor: bgColor,
    });
  }, [onApply, selectedIcon, customIcon, bgColor]);

  const displayIcon = customIcon || selectedIcon;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Icon Mode
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Select Icon</label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_PRESETS.map((icon) => (
              <button
                key={icon}
                onClick={() => handleIconSelect(icon)}
                className={`w-14 h-14 text-3xl rounded-lg border-2 transition-all flex items-center justify-center ${
                  selectedIcon === icon && !customIcon
                    ? 'border-primary-500 bg-primary-500/20'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Custom Emoji</label>
          <input
            type="text"
            value={customIcon}
            onChange={(e) => handleCustomIconChange(e.target.value)}
            placeholder="Paste emoji here..."
            maxLength={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-2xl text-center placeholder-slate-500"
          />
          <p className="text-xs text-slate-500 mt-1">Max 4 characters</p>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Background Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
            />
            <div className="flex flex-wrap gap-1 flex-1">
              <button
                onClick={() => setBgColor('#000000')}
                className={`w-8 h-8 rounded border-2 ${
                  bgColor === '#000000' ? 'border-white' : 'border-slate-600'
                } bg-black`}
              />
              {DEFAULT_COLORS.slice(0, 7).map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`w-8 h-8 rounded border-2 ${
                    bgColor === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Preview</label>
          <div
            className="h-24 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <span className="text-6xl">{displayIcon}</span>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={!displayIcon}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Apply Icon
        </button>
      </div>
    </div>
  );
}
