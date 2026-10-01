import { useState, useCallback, useEffect } from 'react';
import { predictMRI } from '../services/api';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from '../utils/constants';

export const usePrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const selectFile = useCallback((file) => {
    setError(null);
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const analyze = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await predictMRI(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const reset = useCallback(() => {
    removeFile();
  }, [removeFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    selectedFile,
    previewUrl,
    isLoading,
    result,
    error,
    selectFile,
    removeFile,
    analyze,
    reset
  };
};
