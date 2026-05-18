import { signal } from "../core";

interface UseImageUploadOptions {
  maxWidth: number;
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
      const rawImageFile = await selectFile();
      if (!rawImageFile) throw new Error("NO_FILE_SELECTED");

      //only images allowed
      if (!rawImageFile.type.startsWith("image/")) {
        throw new Error("INVALID_FILE_TYPE");
      }

      //resize
      const resizedImageFile = await resizeImage(rawImageFile, o.maxWidth);

      //set raw file
      setFile(() => resizedImageFile);
      setHasFile(() => true);

      //preview url
      const dataUrl = await fileToDataUrl(resizedImageFile);
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

async function resizeImage(
  file: File,
  maxWidth = 800,
  quality = 0.85,
): Promise<File> {
  const img = await createImageBitmap(file);

  const scale = Math.min(1, maxWidth / img.width);

  const canvas = document.createElement("canvas");
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No Context!");

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image conversion failed"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
