"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Tạo URL tạm thời để preview ảnh trước khi upload
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadedUrl(null);
      setError(null);
    }
  };

  // Xử lý khi bấm nút Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload thất bại");
      }

      // Lưu lại URL thực tế trả về từ Cloudflare R2
      setUploadedUrl(data.url);
      setPreviewUrl(null); // Xóa preview tạm
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Test Upload R2</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn hình ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploading}
          />
        </div>

        {/* Hiển thị Preview trước khi upload */}
        {previewUrl && !uploadedUrl && (
          <div className="relative w-full h-48 mt-4">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain rounded-md"
            />
          </div>
        )}

        {/* Hiển thị Lỗi nếu có */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${!file || isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
            transition-colors`}
        >
          {isUploading ? "Đang upload..." : "Upload lên R2"}
        </button>
      </form>

      {/* Hiển thị Ảnh đã upload thành công từ R2 */}
      {uploadedUrl && (
        <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
          <p className="text-green-700 text-sm font-medium mb-3">
            ✅ Upload thành công!
          </p>
          <div className="relative w-full h-48 mb-3">
            <Image
              src={uploadedUrl}
              alt="Uploaded to R2"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 break-all hover:underline"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
