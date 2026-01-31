import { useState, useCallback } from 'react';
import type { LightstickState, PatternType, PatternParams } from '@lightstick/shared';
import { PATTERN_DEFINITIONS, PATTERN_TYPES, CONFIG, DEFAULT_COLORS } from '@lightstick/shared';

interface PatternControlProps {
  onApply: (state: LightstickState) => void;
  onPreview?: (state: LightstickState) => void;
  currentPattern?: PatternType;
  currentParams?: PatternParams;
}

const PATTERN_ICONS: Record<PatternType, JSX.Element> = {
  blink: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" strokeWidth={2} />
    </svg>
  ),
  pulse: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  fade: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  rainbow: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  wave: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  strobe: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

export default function PatternControl({
  onApply,
  onPreview,
  currentPattern,
  currentParams,
}: PatternControlProps) {
  const [selectedPattern, setSelectedPattern] = useState<PatternType | null>(currentPattern || null);
  const [speed, setSpeed] = useState(currentParams?.speed || 1000);
  const [baseColor, setBaseColor] = useState(currentParams?.colors?.[0] || '#FF0000');
  const [isPlaying, setIsPlaying] = useState(false);

  const triggerPreview = useCallback((pattern: PatternType | null, newSpeed?: number, newColor?: string) => {
    if (!pattern) return;
    onPreview?.({
      mode: 'pattern',
      pattern,
      patternParams: { speed: newSpeed ?? speed, colors: [newColor ?? baseColor], intensity: 1 },
      color: newColor ?? baseColor,
    });
  }, [onPreview, speed, baseColor]);

  const handlePatternSelect = (pattern: PatternType) => {
    setSelectedPattern(pattern);
    const def = PATTERN_DEFINITIONS[pattern];
    const newSpeed = def.defaultParams.speed || 1000;
    const newColor = def.defaultParams.colors?.[0] || baseColor;
    setSpeed(newSpeed);
    if (def.defaultParams.colors?.[0]) {
      setBaseColor(newColor);
    }
    triggerPreview(pattern, newSpeed, newColor);
  };

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    triggerPreview(selectedPattern, newSpeed);
  }, [selectedPattern, triggerPreview]);

  const handleColorChange = useCallback((newColor: string) => {
    setBaseColor(newColor);
    triggerPreview(selectedPattern, undefined, newColor);
  }, [selectedPattern, triggerPreview]);

  const handleApply = useCallback(() => {
    if (!selectedPattern) return;
    
    setIsPlaying(true);
    onApply({
      mode: 'pattern',
      pattern: selectedPattern,
      patternParams: {
        speed,
        colors: [baseColor],
        intensity: 1,
      },
      color: baseColor,
    });
  }, [onApply, selectedPattern, speed, baseColor]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    onApply({
      mode: 'color',
      color: '#000000',
    });
  }, [onApply]);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Pattern Mode
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Select Pattern</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PATTERN_TYPES.map((pattern) => {
              const def = PATTERN_DEFINITIONS[pattern];
              return (
                <button
                  key={pattern}
                  onClick={() => handlePatternSelect(pattern)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedPattern === pattern
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                  }`}
                >
                  <div className={selectedPattern === pattern ? 'text-primary-400' : 'text-slate-400'}>
                    {PATTERN_ICONS[pattern]}
                  </div>
                  <span className="text-sm font-medium text-white">{def.displayName}</span>
                  <span className="text-xs text-slate-500 text-center line-clamp-1">{def.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedPattern && (
          <>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Speed: {CONFIG.PATTERN_SPEED_MIN + CONFIG.PATTERN_SPEED_MAX - speed}ms
              </label>
              <input
                type="range"
                min={CONFIG.PATTERN_SPEED_MIN}
                max={CONFIG.PATTERN_SPEED_MAX}
                step={50}
                value={CONFIG.PATTERN_SPEED_MIN + CONFIG.PATTERN_SPEED_MAX - speed}
                onChange={(e) => handleSpeedChange(CONFIG.PATTERN_SPEED_MIN + CONFIG.PATTERN_SPEED_MAX - Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Base Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-transparent"
                />
                <div className="flex flex-wrap gap-1 flex-1">
                  {DEFAULT_COLORS.slice(0, 8).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded border-2 ${
                        baseColor === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-16 rounded-lg overflow-hidden relative">
              {selectedPattern === 'rainbow' ? (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff00ff, #ff0000)',
                    backgroundSize: '200% 100%',
                    animation: `rainbow ${speed}ms linear infinite`,
                  }}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: baseColor,
                    animation: `${selectedPattern} ${speed}ms ${
                      ['pulse', 'fade', 'wave'].includes(selectedPattern)
                        ? 'ease-in-out'
                        : 'steps(1)'
                    } infinite`,
                  }}
                />
              )}
            </div>

            <style>{`
              @keyframes blink {
                0%, 49% { opacity: 1; }
                50%, 100% { opacity: 0; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
              }
              @keyframes fade {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
              }
              @keyframes rainbow {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
              @keyframes wave {
                0%, 100% { opacity: 0.5; }
                25% { opacity: 1; }
                75% { opacity: 0.2; }
              }
              @keyframes strobe {
                0%, 49% { opacity: 1; }
                50%, 100% { opacity: 0; }
              }
            `}</style>
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={!selectedPattern}
            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play Pattern
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
