import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function FileDownload() {
  const { sessionId } = useParams();
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/get/myfiles/${sessionId}`)
      .then((res) => res.json())
      .then((data) => setUrls(data))
      .catch((err) => console.error(err));
  }, [sessionId]);
  return (
    <div>
      <h2>Download your files</h2>
      <ul>
        {urls.map((File, index) => (
          <li key={index}>
            <a href={File.public_url} target="_blank">
              File {index + 1} : {File.file_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
