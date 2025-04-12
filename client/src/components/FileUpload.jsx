import React, { useState } from "react";
import upload from "../upload"; // adjust if your path is different

export default function FileUpload({ uploadTargetId }) {
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await upload(file, uploadTargetId);
      setImageUrl(url);
      console.log("File uploaded to:", url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
}
