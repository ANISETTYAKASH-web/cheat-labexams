import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// const { v4: uuidv4 } = require("uuid");
import { v4 as uuidv4 } from "uuid";

export default function FileUpload() {
  const [selectFiles, setSelectFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [overAllLoading, setOverAllLoading] = useState(false);
  const [overAllError, setOverAllError] = useState(null);
  const [showLink, setShowLink] = useState(false);
  const sessionRef = useRef("");
  let globalSessionId;
  const navigate = useNavigate();
  const backend_endpoint =
    "https://cheat-labexams.onrender.com/get_preassigned_url";
  const fileRef = useRef("");
  function handleButtonChange(e) {
    fileRef.current.click();
  }
  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const overLimit = files.some((file) => file.size > 30 * 1024 * 1024);

    if (overLimit) {
      window.alert("Please select files below 30MB.");
      setOverAllError("Please select files below 30MB.");
      setSelectFiles([]);
      e.target.value = null; // Clear file input
      return; // Exit early
    }

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
    const sessionId = uuidv4();
    sessionRef.current = sessionId;
    const uploadPromises = selectFiles.map(async (file) => {
      const fileName = file.name;
      const fileType = file.type;
      handleStatus(fileName, "getting-url", "getting backend url");

      //fetching pre signed url from backend
      try {
        const response = await fetch(backend_endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName, fileType, sessionId }),
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
          method: "PUT",
          headers: {
            "Content-Type": fileType,
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
    setShowLink(true);
  };
  function handleDownloadFiles(e) {
    e.preventDefault();
    const sessionId = sessionRef.current;
    navigate(`/myfiles/${sessionId}`);
  }

  return (
    <div>
      <button onClick={handleButtonChange}>Select Files</button>
      <input
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFileChange}
        disabled={overAllLoading}
      ></input>
      {overAllError && <strong>OverAllError:{overAllError}</strong>}
      {console.log("length:", selectFiles.length)}
      {selectFiles.length > 0 && (
        <>
          <ul>
            {selectFiles.map((file) => (
              <li>{file.name}</li>
            ))}
          </ul>

          <button onClick={handleAllUpload} disabled={overAllLoading}>
            UPLOAD
          </button>
        </>
      )}
      {showLink && (
        <a
          // href={`http://localhost:3000/myfiles/${sessionRef.current}`}
          onClick={handleDownloadFiles}
        >
          Download your Files
        </a>
      )}
    </div>
  );
}
