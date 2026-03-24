import React, { useState } from 'react';
import { AlertCircle, FileUp, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LabeledInput from '../shared/ui/LabeledInput';
import { addSong } from '../services/api';

type UploadState = 'form' | 'uploading' | 'success' | 'error';

interface UploadFormData {
  title: string;
  artist: string;
  file: File | null;
}

export default function UploadMusicPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>('form');
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    artist: '',
    file: null,
  });
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid audio file (MP3, WAV, OGG, or AAC)');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB
      setError('File size must be less than 100MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.artist || !formData.file) {
      setError('Please fill in all fields and select a file');
      return;
    }

    setState('uploading');
    setError('');
    setUploadProgress(0);

    // Simulate upload progress while we actually make the request
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return 90; // Hold at 90% until request finishes
        return prev + 10;
      });
    }, 200);

    try {
      // Send the actual API request to add the song
      await addSong(formData.title, formData.artist);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Short delay for visual effect of hitting 100%
      setTimeout(() => setState('success'), 500);
    } catch (err) {
      clearInterval(interval);
      console.error('Failed to add song:', err);
      setError('There was an error saving your song to the playlist. Please try again.');
      setState('error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      file: null,
    });
  };

  const handleBackToForm = () => {
    resetForm();
    setState('form');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getHeaderTitle = () => {
    switch (state) {
      case 'uploading': return 'UPLOADING';
      case 'success': return 'SUCCESS';
      case 'error': return 'ERROR';
      default: return 'UPLOAD MUSIC';
    }
  };

  return (
    <div className="h-screen w-full flex justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 w-full">
          <h1 className="font-primary text-[15px] font-semibold tracking-[3px] text-white">
            {getHeaderTitle()}
          </h1>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 border border-border-hover rounded-lg text-white hover:bg-white/5 transition-colors font-secondary text-[13px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-surface rounded-2xl border border-border p-8 overflow-hidden">
          
          {/* Form State */}
          {state === 'form' && (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 items-center max-w-md">
              <h2 className="font-primary text-2xl font-semibold text-white">Add New Song</h2>

              {/* Form Inputs */}
              <div className="w-full flex flex-col gap-4">
                <LabeledInput
                  label="Artist Name"
                  placeholder="Enter artist name"
                  value={formData.artist}
                  onChange={(value) => setFormData(prev => ({ ...prev, artist: value }))}
                />

                <LabeledInput
                  label="Song Name"
                  placeholder="Enter song name"
                  value={formData.title}
                  onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                />
              </div>

              {/* File Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`w-full h-50 border-2 border-border-hover rounded-2xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                  dragActive ? 'bg-white/5 border-text-primary' : 'hover:bg-white/5'
                }`}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <FileUp className="w-12 h-12 text-white" />
                <p className="font-secondary text-sm text-white">
                  {formData.file ? formData.file.name : 'Drag & drop files here'}
                </p>
                <div className="px-4.5 py-2.5 bg-white text-black rounded-lg font-secondary font-medium text-[13px] hover:bg-gray-200 transition-colors">
                  Select File
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full p-3 bg-error/10 border border-error/50 rounded-lg text-error text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Form Buttons */}
              <div className="w-full flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4.5 py-2.5 border border-border-hover text-white rounded-lg hover:bg-white/5 transition-colors font-secondary text-[13px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.title || !formData.artist || !formData.file}
                  className="px-4.5 py-2.5 bg-primary text-black rounded-lg font-secondary font-medium text-[13px] hover:bg-[#a6e600] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_12px_var(--color-primary)] disabled:shadow-none"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {/* Uploading State */}
          {state === 'uploading' && (
            <div className="w-full flex flex-col items-center gap-6 max-w-md">
              <h2 className="font-primary text-2xl font-semibold text-white">Uploading Your File</h2>
              
              <div className="w-full bg-surface-hover rounded-2xl border border-border p-6 flex flex-col gap-4">
                <p className="font-secondary text-sm text-white truncate">
                  {formData.file?.name || 'song.mp3'}
                </p>
                <p className="font-secondary text-sm text-text-secondary">
                  {formData.file ? formatFileSize(formData.file.size) : '0 MB'}
                </p>
              </div>
              
              <div className="w-full flex flex-col gap-2 items-center">
                <div className="w-full max-w-100 h-2 bg-neutral-700 rounded overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded shadow-[0_0_8px_var(--color-primary)] transition-all duration-200 ease-out" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="font-secondary text-sm text-text-secondary">
                  {uploadProgress}% Complete
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="w-full flex flex-col items-center gap-6 max-w-md text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-primary mb-2 shadow-[0_0_12px_var(--color-primary)]">
                <Check className="w-20 h-20" />
              </div>
              
              <h2 className="font-primary text-2xl font-semibold text-white">Upload Successful</h2>
              
              <p className="font-secondary text-sm text-text-secondary max-w-100">
                Your song has been added to the playlist
              </p>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-4.5 py-2.5 bg-primary text-black rounded-lg font-secondary font-medium text-[13px] hover:bg-[#a6e600] transition-colors shadow-[0_0_12px_var(--color-primary)]"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="w-full flex flex-col items-center gap-6 max-w-md text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-error mb-2 shadow-[0_0_12px_var(--color-error)]">
                <X className="w-20 h-20" />
              </div>
              
              <h2 className="font-primary text-2xl font-semibold text-white">Upload Failed</h2>
              
              <p className="font-secondary text-sm text-text-secondary max-w-100">
                {error || 'There was an error uploading your file. Please try again.'}
              </p>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleBackToForm}
                  className="px-4.5 py-2.5 border border-border-hover text-white rounded-lg hover:bg-white/5 transition-colors font-secondary text-[13px] font-medium"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4.5 py-2.5 bg-error text-white rounded-lg font-secondary font-medium text-[13px] hover:bg-red-600 transition-colors shadow-[0_0_12px_var(--color-error)]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
