import { useState, useRef } from "react";

export default function FileUpload() {
  const [selectFiles, setSelectFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [overAllLoading, setOverAllLoading] = useState(false);
  const [overAllError, setOverAllError] = useState(null);
  const backend_endpoint = "http://localhost:3000/upload";
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

  const handleAllUpload = async () => {
    if (selectFiles.length === 0) {
      setOverAllError("please select files ");
      return;
    }
    setOverAllLoading(true);
    const uploadPromises = selectFiles.map(async (file) => {
      const fileName = file.name;
      const fileType = file.type;
      handleStatus(fileName, "getting-url", "getting backend url");

      try {
        const response = await fetch(backend_endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName, fileType }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `processing failed ${errorData.message}||${response.statusText}`
          );
        }
        const { url: preassigned_url } = await response.json();
        if (!preassigned_url) {
          throw new Error(`no preassigned url found`);
        }
        setUploadStatus(fileName, "uploading", "uploading to S3");

        //uploading files to s3 bucket(r2)
        const upload = await fetch(preassigned_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: file,
        });
        if (!upload.ok) {
          throw new Error(
            `uploading s3 failed: ${upload.statusText},${upload.status} `
          );
        }
        setUploadStatus(fileName, "uploaded", "uploaded to s3 succefully");
      } catch (err) {
        console.error(`error while processing ${fileName}`, err);
        setUploadStatus(fileName, "error", err.message || "upload failed");
      }
    });
    await Promise.allSettled(uploadPromises);

    setOverAllLoading(false);
    const anyFailed = Object.values(uploadStatus).some(
      (s) => s.status == "error"
    );
    if (anyFailed) {
      setOverAllError("failed to process few files check status for them");
    }
  };
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
