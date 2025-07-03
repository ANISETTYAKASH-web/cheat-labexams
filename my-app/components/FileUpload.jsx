import { useState, useRef } from "react";

export default function FileUpload() {
  const [selectFiles, setSelectFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [overAllLoading, setOverAllLoading] = useState(false);
  const [overAllError, setOverAllError] = useState(null);

  const fileRef = useRef("");
  function handleButtonChange(e) {
    fileRef.current.click();
  }
  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    console.log(e.target.files);
    console.log(files);
    setSelectFiles(files);
    setUploadStatus({});
    setOverAllError(null);
  }
  function handleStatus(filename, status, message) {
    setUploadStatus((prevstatus) => ({
      ...prevstatus,
      [filename]: { status, message },
    }));
  }
  async function handleUpload() {
    if (selectFiles.length === 0) {
      alert("no files selected");
    }
    const formData = new FormData();
    selectFiles.forEach((element) => {
      formData.append("files", element);
    });
    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      console.log(res);
      const result = await res.json(res);
      console.log(result);
      alert("file uploaded succesfully");
    } catch (err) {
      console.error(err);
      alert("upload failed");
    }
  }
  return (
    <div>
      <button onClick={handleButtonChange}>Select Files</button>
      <input
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFileChange}
      ></input>
      {selectFiles.length > 0 && (
          <ul>
            {selectFiles.map((file) => (
              <li>{file.name}</li>
            ))}
          </ul>
        ) && <button onClick={handleUpload}>UPLOAD</button>}
    </div>
  );
}
