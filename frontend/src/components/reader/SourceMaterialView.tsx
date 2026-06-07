import React, { useState } from 'react';

export interface ChunkPayload {
  chunkId: string;
  textSegment: string;
  pageOffset?: number;
}

interface SourceMaterialViewProps {
  chunks: ChunkPayload[];
  activeChunkId?: string;
  enableFocusRuler: boolean;
}

export const SourceMaterialView: React.FC<SourceMaterialViewProps> = ({
  chunks,
  activeChunkId,
  enableFocusRuler,
}) => {
  const [rulerTop, setRulerTop] = useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableFocusRuler) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    setRulerTop(e.clientY - bounds.top);
  };

  return (
    <div
      className="relative border border-slate-800 rounded-xl p-6 bg-slate-950 max-h-[600px] overflow-y-auto custom-scrollbar select-none"
      onMouseMove={handleMouseMove}
    >
      {/* The Dynamic Reading Helper Ruler */}
      {enableFocusRuler && (
        <div
          className="absolute left-0 right-0 h-8 bg-teal-500/10 border-y border-teal-500/40 pointer-events-none transition-all duration-75 mix-blend-screen"
          style={{ top: `${rulerTop - 16}px` }}
        />
      )}

      <div className="space-y-6 text-slate-300 tracking-wide leading-relaxed">
        {chunks.map((chunk) => (
          <div
            key={chunk.chunkId}
            className={`p-4 rounded-lg transition-all duration-300 border ${
              chunk.chunkId === activeChunkId
                ? 'bg-teal-950/40 border-teal-500 text-teal-100 font-medium shadow-lg shadow-teal-500/5 scale-[1.01]'
                : 'bg-transparent border-transparent text-slate-400'
            }`}
          >
            <span className="text-xs uppercase tracking-widest text-slate-600 block mb-2 font-semibold">
              Source Chunk Index: {chunk.chunkId} {chunk.pageOffset && `• Page ${chunk.pageOffset}`}
            </span>
            <p className="text-base select-text">{chunk.textSegment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceMaterialView;
