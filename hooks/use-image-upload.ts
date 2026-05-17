import { signal } from "../core";

interface UseImageUploadOptions {
  maxWidth: number;
  maxHeight: number;
  upload: (file: File) => Promise<void>;
}
export function useImageUpload(o: UseImageUploadOptions) {
  // signals
  const [previewUrl, setPreviewUrl] = signal<string>("");
  const [error, setError] = signal<string>("");
  const hasImage = signal<string>("");
  const hasError = signal<string>("");
  const [isProcessing, setIsProcessing] = signal(false);
  const [isUploading, setIsUploading] = signal(false);
  const [isProcessed, setIsProcessed] = signal(false);
  const [isUploaded, setIsUploaded] = signal(false);

  //functions
  function select() {
    // - auto resize
    // - auto respect aspect ratio
    // - auto Qualitiy paramters
    // - auto exif stripping
    // - auto compression
    // - auto webp conversion
  }
  function upload() {}
  function clear() {}

  return {
    previewUrl,
    error,
    hasImage,
    hasError,
    isProcessing,
    isUploading,
    isProcessed,
    isUploaded,
    select,
    upload,
    clear,
  };
}
