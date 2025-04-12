import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase.js"; // Ensure this path is correct for your project
import { useAppStore } from "../store/index.js"; // Path to your Zustand store

// Function to upload a file to Firebase Storage
const upload = async (file, uploadTargetId) => {
  const { setUploadProgress, setUploadFileName, setUploadTargetId } = useAppStore.getState();

  // Clean filename by replacing spaces with underscores and adding timestamp to avoid name collisions
  const timestamp = Date.now();
  const cleanedName = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
  const storagePath = `uploads/${timestamp}_${cleanedName}`; // Generate storage path
  const storageRef = ref(storage, storagePath); // Create a reference to the storage path

  // Create the upload task for the file
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Set target ID and file name in the store (you can use this for tracking the UI state)
  setUploadTargetId(uploadTargetId);
  setUploadFileName(file.name);

  return new Promise((resolve, reject) => {
    // Monitor the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate upload progress (percentage)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress); // Update the progress state in the store
      },
      (error) => {
        // Handle errors (log the error and reject the promise)
        console.error("Error uploading file: ", error);
        reject("Something went wrong! " + error.code);
      },
      () => {
        // Once upload is complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Reset progress and upload details in the store
          setUploadProgress(0);
          setUploadTargetId(undefined);
          setUploadFileName(undefined);

          // Resolve with the download URL (you can use this to display the file's URL)
          resolve(downloadURL);
        });
      }
    );
  });
};

export default upload;
