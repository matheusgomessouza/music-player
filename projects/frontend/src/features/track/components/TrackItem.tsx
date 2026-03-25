import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  position: number;
}

interface TrackItemProps {
  track: Track;
  isSelected: boolean;
  onSelect: (track: Track) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  index: number;
}

export default function TrackItem({
  track,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  index,
}: TrackItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onClick={() => onSelect(track)}
      className={`flex items-center justify-between cursor-move transition-all py-3 px-4 rounded-lg ${
        isSelected
          ? 'bg-primary/20 border border-primary/50'
          : 'bg-transparent border border-transparent hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <GripVertical className="w-4 h-4 text-white shrink-0 opacity-50" />
        <div className="min-w-0 flex-1">
          <p className="font-primary text-sm font-medium text-white truncate">{track.title}</p>
          <p className="font-secondary text-xs text-text-secondary truncate">{track.artist}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="font-secondary text-xs text-text-secondary">{track.duration}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(track.id);
          }}
          className="hover:opacity-80 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-text-secondary hover:text-error transition-colors" />
        </button>
      </div>
    </div>
  );
}
