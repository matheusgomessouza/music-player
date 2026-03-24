import { Printer } from 'lucide-react';

interface PlaylistHeaderProps {
  onPrint: () => void;
}

export default function PlaylistHeader({ onPrint }: PlaylistHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border">
      <h2 className="font-primary text-lg font-semibold text-white">Playlist</h2>
      <button 
        onClick={onPrint}
        className="flex items-center gap-2 px-3.5 py-2 border border-border-hover rounded-lg text-white hover:bg-white/5 transition-colors font-secondary text-[13px]"
      >
        <Printer className="w-3.5 h-3.5" />
        Print Playlist
      </button>
    </div>
  );
}
