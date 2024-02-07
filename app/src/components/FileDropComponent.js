import "./FileDropComponent.css";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";

function FileDropComponent({ onFileUpload, dataEntered }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const ext = file.name.split(".").pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (e) => {
          let data = e.target.result;
          if (ext === "csv") {
            Papa.parse(data, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                setSelectedFile(file);
                setFileName(file.name);
                onFileUpload(results.meta.fields, file);
              },
            });
          } else if (ext === "xlsx") {
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setSelectedFile(file);
            setFileName(file.name);
            onFileUpload(jsonData[0], file); // Assuming first row has headers
          }
        };

        if (ext === "csv") {
          reader.readAsText(file);
        } else if (ext === "xlsx") {
          reader.readAsBinaryString(file);
        } else {
          alert("Only CSV and Excel files are allowed.");
        }
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="file-area"
      id={`${dataEntered ? "file-uploaded" : ""}`}
    >
      <input {...getInputProps()} />
      {fileName ? (
        <p>File Uploaded: {fileName}</p>
      ) : (
        <p>Drag & drop a file here, or click to select one</p>
      )}
    </div>
  );
}

export default FileDropComponent;
