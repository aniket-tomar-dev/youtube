import axios from "axios";

export const uploadToCloudinary = async (
  file: File,
  resourceType: "image" | "video",
  onProgress?: (progress: number) => void,
) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  try {
    const response = await axios.post(uploadUrl, formData, {
      onUploadProgress: (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded / event.total) * 100);

          onProgress?.(progress);
        }
      },
    });

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error?.message || "Cloudinary upload failed.",
    );
  }
};
