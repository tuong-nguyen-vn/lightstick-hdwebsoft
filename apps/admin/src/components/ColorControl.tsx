import { useState, useCallback } from 'react';
import type { LightstickState } from '@lightstick/shared';
import { DEFAULT_COLORS } from '@lightstick/shared';

interface ColorControlProps {
  onApply: (state: LightstickState) => void;
  currentColor?: string;
}

export default function ColorControl({ onApply, currentColor = '#FFFFFF' }: ColorControlProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const handleApply = useCallback(() => {
    onApply({
      mode: 'color',
      color: selectedColor,
    });
  }, [onApply, selectedColor]);

  const handlePresetClick = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        Color Mode
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Quick Colors</label>
          <div className="grid grid-cols-5 gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handlePresetClick(color)}
                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColor === color ? 'border-white ring-2 ring-primary-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Custom Color</label>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono uppercase"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        <div
          className="h-16 rounded-lg flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: selectedColor }}
        >
          <span
            style={{
              color: isLightColor(selectedColor) ? '#000' : '#FFF',
            }}
          >
            Preview
          </span>
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Apply Color
        </button>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
