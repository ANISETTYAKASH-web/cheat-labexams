import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import FileUpload from "../components/FileUpload";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FileUpload />
      <div>
        <input type="file" multiple id="file-input"></input>
      </div>
    </>
  );
}

export default App;
