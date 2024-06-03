import "./InputSection.css";
import FileDropComponent from "./FileDropComponent";
import LoadingMessage from "./LoadingMessage";
import InfoIcon from "./InfoIcon";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable as RBDraggable,
} from "react-beautiful-dnd";
import { API_BASE_URL } from "./../config";
import earthSvg from "./images/googleEarth.svg";
import download_svg from "./images/file_download.svg";
import down_arrow from "./images/down-arrow.svg";
import copy_svg from "./images/copy-svg.svg";

function InputSection({ onApiDataReceived, onApiDataChange }) {
  const [extractedColumns, setExtractedColumns] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [zipcodeItem, setZipcodeItem] = useState([]);
  const [mainDataItem, setMainDataItem] = useState([]);
  const [secDataItem, setSecDataItem] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toggleColumns, setToggleColumns] = useState(false);
  const [buttonVis, setButtonVis] = useState(false);
  const [submittedVis, setSubmittedVis] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [heatmapUrl, setHeatmapUrl] = useState("");
  const [kmlUrl, setKmlUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [dataEntered, setDataEntered] = useState(false);
  const [popups, setPopups] = useState({});
  const [dragging, setDragging] = useState(false);

  const handleIconClick = (id) => {
    setPopups((prevPopups) => ({
      ...prevPopups,
      [id]: !prevPopups[id],
    }));
  };

  useEffect(() => {
    const closeAllPopups = () => {
      setPopups({});
    };

    document.addEventListener("mousedown", closeAllPopups);

    return () => {
      document.removeEventListener("mousedown", closeAllPopups);
    };
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleMouseOver = (event) => {
    if (dragging) {
      event.currentTarget.id = "input-col-hover";
    }
  };

  const handleMouseOut = (event) => {
    event.currentTarget.id = "";
  };

  const toggleMenu = (e) => {
    // Check if the click event originated from inside the side menu content
    if (e.currentTarget !== e.target) {
      return; // If it did, then ignore the click and return
    }

    setIsExpanded(!isExpanded);
  };

  function handleOnDragEnd(result) {
    setDragging(false);
    const { source, destination } = result;

    // Exit if no destination
    if (!destination) return;

    const getItemList = (id) => {
      switch (id) {
        case "columnList":
          return [...columnData];
        case "zipcodeList":
          return [...zipcodeItem];
        case "mainDataList":
          return [...mainDataItem];
        case "secDataList":
          return [...secDataItem];
        default:
          return [];
      }
    };

    // If source and destination are the same, just reorder the list.
    if (source.droppableId === destination.droppableId) {
      const list = getItemList(source.droppableId);
      const [movedItem] = list.splice(source.index, 1);
      list.splice(destination.index, 0, movedItem);
      setListState(source.droppableId, list);
      return; // Exit early
    }

    // Handle special cases for zipcodeList and mainDataList
    const destList = getItemList(destination.droppableId);
    let replacedItem = null;
    if (
      (destination.droppableId === "zipcodeList" ||
        destination.droppableId === "mainDataList") &&
      destList.length > 0
    ) {
      [replacedItem] = destList.splice(0, 1);
    }

    // 1. Remove the dragged item from the source list and update its state.
    const sourceList = getItemList(source.droppableId);
    const [draggedItem] = sourceList.splice(source.index, 1);
    setListState(source.droppableId, sourceList);

    // 2. Add the dragged item to the destination list and update its state.
    destList.splice(destination.index, 0, draggedItem);
    setListState(destination.droppableId, destList);

    // 3. If there was a replaced item, add it back to columnList.
    if (replacedItem) {
      setColumnData((prevColumnData) => [...prevColumnData, replacedItem]);
    }
  }

  function setListState(id, list) {
    switch (id) {
      case "columnList":
        setColumnData(list);
        break;
      case "zipcodeList":
        setZipcodeItem(list);
        break;
      case "mainDataList":
        setMainDataItem(list);
        break;
      case "secDataList":
        setSecDataItem(list);
        break;
      default:
        break;
    }
  }

  function handleOnDragStart(start) {
    setDragging(true);
  }

  const onFileUpload = (extractedColumns, uploadedFile) => {
    setExtractedColumns(extractedColumns);
    setToggleColumns(true);
    setFile(uploadedFile);
    setDataEntered(true);
  };

  const handleDownload = async () => {
    console.log(heatmapUrl);
    try {
      const response = await fetch(heatmapUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Programmatically trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = prefix + "_heatmap.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleKmlDownload = async () => {
    console.log(kmlUrl);
    try {
      const response = await fetch(kmlUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Programmatically trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = prefix + "_heatmap.kml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleSubmit = async () => {
    if (!buttonVis) {
      return;
    }
    setIsLoading(true);
    onApiDataChange();

    const initialPosStr = secDataItem.map((item) => item.initialPos).join(",");
    console.log(initialPosStr);
    const data = new FormData();
    data.append("zip_col", zipcodeItem[0].initialPos);
    data.append("main_col", mainDataItem[0].initialPos);
    data.append("sec_col", initialPosStr);
    data.append("city", prefix);
    if (file) {
      data.append("excel_file", file);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/heatmap/zipcode`,
        data
      );
      console.log("Data uploaded successfully:", response.data);
      if (response.data.status === "success") {
        onApiDataReceived(response.data.heatmap_url);
        setHeatmapUrl(response.data.heatmap_url);
        setKmlUrl(response.data.kml_url);
      }
    } catch (error) {
      console.error("There was an error uploading the data:", error);
    }

    setSubmittedVis(true);
    setIsLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied!"); // Set a success message
      // Optionally set a timeout to clear the message after a few seconds
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy"); // Set a failure message
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  useEffect(() => {
    setColumnData(
      extractedColumns.map((value, index) => ({
        value,
        initialPos: index,
      }))
    );
    setZipcodeItem([]);
    setMainDataItem([]);
    setSecDataItem([]);
  }, [extractedColumns]);

  useEffect(() => {
    if (zipcodeItem.length > 0 && mainDataItem.length > 0) {
      setButtonVis(true);
      setSubmittedVis(false);
    } else {
      setButtonVis(false);
      setSubmittedVis(false);
    }
  }, [zipcodeItem, mainDataItem]);

  return (
    <div className={`side-menu ${isExpanded ? "collapsed" : "expanded"}`}>
      {popups["unique-popup-1"] && (
        <div className="popup" onMouseDown={stopPropagation}>
          Place the column that contains the zipcode values here. Only one
          column will be accepted.
        </div>
      )}
      <div className="side-menu-content">
        <div className={`tab ${isExpanded ? "down" : ""}`} onClick={toggleMenu}>
          <img src={down_arrow} onClick={toggleMenu} />
        </div>
        <div className="beginning-content">
          <div className={`file-div ${dataEntered ? "shift-left" : ""}`}>
            <p className="data-header">Data Source</p>
            <FileDropComponent
              onFileUpload={onFileUpload}
              dataEntered={dataEntered}
            />
          </div>
          <div
            className="mid-content"
            style={{ display: dataEntered ? "flex" : "none" }}
          >
            <DragDropContext
              onDragEnd={handleOnDragEnd}
              onDragStart={handleOnDragStart}
            >
              <div
                className="column-section"
                // style={{ display: toggleColumns ? "flex" : "none" }}
              >
                <div className="vert-white-line" />
                <div className="start-column">
                  <p className="data-header">Data Columns</p>
                  <Droppable droppableId="columnList">
                    {(provided) => (
                      <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="list main-list"
                      >
                        {columnData.map((item, index) => (
                          <RBDraggable
                            draggableId={item.initialPos.toString()}
                            index={index}
                            key={item.initialPos}
                          >
                            {(provided) => (
                              <li
                                className="box"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="inside-box">
                                  <div className="inside-box-left">
                                    <svg
                                      width="21px"
                                      height="21px"
                                      viewBox="0 0 15 15"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="#223651"
                                      className="bi bi-three-dots-vertical"
                                    >
                                      <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    </svg>
                                  </div>
                                  <span>{item.value}</span>
                                </div>
                              </li>
                            )}
                          </RBDraggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </div>
                <div className="vert-white-line" />
                <div
                  className="input-cols"
                  // id={`${dragging ? "" : "input-col-hover"}`}
                >
                  <div className="zipcode-col">
                    <div className="column-title-div">
                      <p className="data-header">Zipcode Column</p>
                      <InfoIcon text="Place the column that contains the zipcodes here. Only one value will be accepted." />
                    </div>
                    <Droppable droppableId="zipcodeList">
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="list zipcode-list input-cols-list"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {zipcodeItem.map((item, index) => (
                            <RBDraggable
                              draggableId={item.initialPos.toString()}
                              index={index}
                              key={item.initialPos}
                            >
                              {(provided) => (
                                <li
                                  className="box"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="inside-box">
                                    <div className="inside-box-left">
                                      <svg
                                        width="21px"
                                        height="21px"
                                        viewBox="0 0 15 15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#223651"
                                        className="bi bi-three-dots-vertical"
                                      >
                                        <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                      </svg>
                                    </div>
                                    <span>{item.value}</span>
                                  </div>
                                </li>
                              )}
                            </RBDraggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                  <div className="main-data-col">
                    <div className="column-title-div">
                      <p className="data-header">Main Data Column</p>
                      <InfoIcon text="Place the column that contains the data you want the zipcode coloring based off of. Only one value will be accepted." />
                    </div>
                    <Droppable droppableId="mainDataList">
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="list zipcode-list input-cols-list"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {mainDataItem.map((item, index) => (
                            <RBDraggable
                              draggableId={item.initialPos.toString()}
                              index={index}
                              key={item.initialPos}
                            >
                              {(provided) => (
                                <li
                                  className="box"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="inside-box">
                                    <div className="inside-box-left">
                                      <svg
                                        width="21px"
                                        height="21px"
                                        viewBox="0 0 15 15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#223651"
                                        className="bi bi-three-dots-vertical"
                                      >
                                        <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                      </svg>
                                    </div>
                                    <span>{item.value}</span>
                                  </div>
                                </li>
                              )}
                            </RBDraggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                </div>
                <div className="big-col">
                  <div className="sec-data-col">
                    <div className="column-title-div">
                      <p className="data-header">Secondary Data Column</p>
                      <InfoIcon text="Place columns here where you would like the data to be associated with the zipcode. Multiple values are accepted. These columns will not affect the coloring of zipcodes." />
                    </div>
                    <Droppable droppableId="secDataList">
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="list sec-data-list input-cols-list"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {secDataItem.map((item, index) => (
                            <RBDraggable
                              draggableId={item.initialPos.toString()}
                              index={index}
                              key={item.initialPos}
                            >
                              {(provided) => (
                                <li
                                  className="box"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="inside-box">
                                    <div className="inside-box-left">
                                      <svg
                                        width="21px"
                                        height="21px"
                                        viewBox="0 0 15 15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#223651"
                                        className="bi bi-three-dots-vertical"
                                      >
                                        <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                      </svg>
                                    </div>
                                    <span>{item.value}</span>
                                  </div>
                                </li>
                              )}
                            </RBDraggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                </div>
                <div className="vert-white-line" />
              </div>
            </DragDropContext>
            <div
              className="final-section"
              // style={{ display: buttonVis ? "flex" : "none" }}
            >
              <div className="column-title-div">
                <p className="data-header">File Prefix</p>
                <InfoIcon text="Optional value. This will append the prefix to the file name for organizational purposes on your end." />
              </div>
              <input
                type="text"
                value={prefix}
                onChange={(e) => {
                  setPrefix(e.target.value);
                }}
                className="text-input"
              ></input>
              <button
                onClick={handleSubmit}
                className={`submit-btn ${isLoading ? "btn-load" : ""} ${
                  buttonVis ? "" : "btn-disabled"
                }`}
              >
                {isLoading ? <LoadingMessage /> : "Generate Heatmap"}
              </button>
              {/* {isLoading && <LoadingMessage />} */}
              <div
                className="submittedSection"
                style={{ display: submittedVis ? "flex" : "none" }}
              >
                <div
                  className="copy-link-section"
                  onClick={(e) => {
                    copyToClipboard(heatmapUrl);
                  }}
                >
                  <img src={copy_svg} />
                  <p className="blue-text">Copy Link</p>

                  {copySuccess && (
                    <p className="copy-feedback">{copySuccess}</p>
                  )}
                </div>
                <div className="download-section">
                  <img src={download_svg} />
                  <a
                    onClick={handleDownload}
                    href="javascript:void(0)"
                    style={{ cursor: "pointer" }}
                  >
                    Download HTML File
                  </a>
                </div>
                <div className="download-section" style={{ cursor: "pointer" }}>
                  <img
                    src={earthSvg}
                    onClick={handleKmlDownload}
                    alt="info icon"
                  />
                  <a onClick={handleKmlDownload} href="javascript:void(0)">
                    Download KML File
                  </a>
                  <InfoIcon text="KML files can only be viewed through Google Maps. Visit https://www.google.com/maps/d/u/0/ to create a new map and import the KML file." />
                  {/* <img
                    src={infoSvg}
                    onClick={() => {
                      alert(
                        "KML files can only be viewed through Google Maps. Visit https://www.google.com/maps/d/u/0/ to create a new map and import the KML file."
                      );
                    }}
                    alt="info icon"
                  /> */}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`description-div`}
            style={{ display: dataEntered ? "none" : "flex" }}
          >
            <h1>Heatmap by Zipcode Visualizer</h1>
            <p>
              This tool creates heatmaps from zipcode-grouped data. Both CSV and XLSX files are accepted. For Excel files, place the data in the top left corner of the sheet to avoid unexpeted results. Drag and drop or select your file from the box on the left to get started. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputSection;
