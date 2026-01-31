import { useState, useCallback } from 'react';
import type { LightstickState } from '@lightstick/shared';
import { YEP_SCENES, type ScenePreset } from '@lightstick/shared';

interface SceneControlProps {
  onApply: (state: LightstickState) => void;
  onPreview?: (state: LightstickState) => void;
}

function getPatternIcon(pattern?: string): JSX.Element {
  switch (pattern) {
    case 'blink':
      return <span className="text-lg">💡</span>;
    case 'pulse':
      return <span className="text-lg">💓</span>;
    case 'rainbow':
      return <span className="text-lg">🌈</span>;
    case 'strobe':
      return <span className="text-lg">⚡</span>;
    default:
      return <span className="text-lg">🎨</span>;
  }
}

export default function SceneControl({ onApply, onPreview }: SceneControlProps) {
  const [selectedScene, setSelectedScene] = useState<ScenePreset | null>(null);

  const handleSceneSelect = useCallback((scene: ScenePreset) => {
    setSelectedScene(scene);
    onPreview?.(scene.state);
  }, [onPreview]);

  const handleSceneHover = useCallback((scene: ScenePreset) => {
    onPreview?.(scene.state);
  }, [onPreview]);

  const handleApply = useCallback(() => {
    if (selectedScene) {
      onApply(selectedScene.state);
    }
  }, [onApply, selectedScene]);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Scene Presets
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {YEP_SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => handleSceneSelect(scene)}
            onMouseEnter={() => handleSceneHover(scene)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedScene?.id === scene.id
                ? 'border-primary-500 bg-slate-700 ring-2 ring-primary-500/50'
                : 'border-slate-600 hover:border-primary-500 bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {scene.state.color && (
                <div
                  className="w-6 h-6 rounded-full border-2 border-slate-500"
                  style={{ backgroundColor: scene.state.color }}
                />
              )}
              {scene.state.pattern && getPatternIcon(scene.state.pattern)}
            </div>
            <span className="text-sm font-medium text-white">{scene.label}</span>
            {scene.description && (
              <span className="text-xs text-slate-500 text-center">{scene.description}</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleApply}
        disabled={!selectedScene}
        className="w-full mt-4 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Apply Scene
      </button>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Chọn scene để xem preview, nhấn Apply để áp dụng
      </p>
    </div>
  );
}
