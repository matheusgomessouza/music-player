const API_URL = 'http://localhost:3000';

export const getPlaylist = async () => {
  const response = await fetch(`${API_URL}/playlist`);
  if (!response.ok) throw new Error('Failed to fetch playlist');
  return response.json();
};

export const uploadTrack = async (file: File, title: string, artist: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('artist', artist);

  const response = await fetch(`${API_URL}/api/v1/tracks/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload error response:', errorText);
    throw new Error(`Failed to upload track: ${response.status} ${errorText}`);
  }
  return response.json();
};

export const addSong = async (title: string, artist: string, filename: string, duration: string, position?: number) => {
  const response = await fetch(`${API_URL}/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, artist, filename, duration, position }),
  });
  if (!response.ok) throw new Error('Failed to add song');
  return response.json();
};

export const removeSongByTitle = async (title: string) => {
  const response = await fetch(`${API_URL}/playlist/title/${encodeURIComponent(title)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove song');
  return response.json();
};

export const removeSongByPosition = async (position: number) => {
  const response = await fetch(`${API_URL}/playlist/position/${position}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove song');
  return response.json();
};

export const moveSong = async (fromPosition: number, toPosition: number) => {
  const response = await fetch(`${API_URL}/playlist/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromPosition, toPosition }),
  });
  if (!response.ok) throw new Error('Failed to move song');
  return response.json();
};

export const printPlaylist = async () => {
  const response = await fetch(`${API_URL}/playlist/print`);
  if (!response.ok) throw new Error('Failed to print playlist');
  return response.json();
};
