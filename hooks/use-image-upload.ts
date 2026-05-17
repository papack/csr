import { signal } from "../core";

interface UseImageUploadOptions {
  maxWidth: number;
  maxHeight: number;
}
export function useImageUpload(o: UseImageUploadOptions) {
  // signals
  const [file, setFile] = signal<File | null>(null);
  const [previewUrl, setPreviewUrl] = signal<string>("");
  const [hasFile, setHasFile] = signal<boolean>(false);
  const [isRunning, setIsRunning] = signal(false);
  const [isDone, setisDone] = signal(true);

  //select::
  async function select() {
    setIsRunning(() => true);
    setisDone(() => false);
    try {
      //select file
      const f = await selectFile();
      if (!f) throw new Error("NO_FILE_SELECTED");

      //only images allowed
      if (!f.type.startsWith("image/")) {
        throw new Error("INVALID_FILE_TYPE");
      }

      //set raw file
      setFile(() => f);
      setHasFile(() => true);

      //TODO
      // - auto resize
      // - auto respect aspect ratio
      // - auto Qualitiy paramters
      // - auto exif stripping
      // - auto compression
      // - auto webp conversion

      //preview url
      const dataUrl = await fileToDataUrl(f);
      setPreviewUrl(() => dataUrl);
    } catch {
    } finally {
      setIsRunning(() => false);
      setisDone(() => true);
    }
  }
  function clear() {
    setHasFile(() => false);
    setPreviewUrl(() => "");
    setFile(() => null);
  }

  return {
    file,
    previewUrl,
    hasFile,
    isProcessing: isRunning,
    isProcessed: isDone,
    select,
    clear,
  };
}

function selectFile(): Promise<File | null> {
  return new Promise((res) => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      res(input.files?.[0] ?? null);
    };

    input.click();
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onload = () => {
      res(reader.result as string);
    };

    reader.onerror = rej;

    reader.readAsDataURL(file);
  });
}
