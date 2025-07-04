import "./App.css";
import FileUpload from "../components/FileUpload";
import { Route, Routes } from "react-router-dom";
import FileDownload from "../components/FileDownload";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FileUpload />}></Route>
        <Route path="/myfiles/:sessionId" element={<FileDownload />}></Route>
      </Routes>
    </>
  );
}

export default App;
