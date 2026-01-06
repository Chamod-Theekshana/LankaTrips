import React, { useState } from 'react';

export default function CloudinaryUpload({ onUpload, multiple = false, className = "" }) {
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'locations');
    formData.append('folder', 'lankatrips');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dkw8nqukp/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      if (multiple) {
        const uploads = await Promise.all(files.map(uploadToCloudinary));
        const urls = uploads.map(result => result.secure_url);
        onUpload(urls);
      } else {
        const result = await uploadToCloudinary(files[0]);
        onUpload(result.secure_url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
    </div>
  );
}