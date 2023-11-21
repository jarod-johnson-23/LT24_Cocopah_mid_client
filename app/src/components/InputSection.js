import "./InputSection.css";
import FileDropComponent from "./FileDropComponent";
import LoadingMessage from "./LoadingMessage";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable as RBDraggable,
} from "react-beautiful-dnd";
import { API_BASE_URL } from "./../config";

function InputSection({ onApiDataReceived }) {
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

  const toggleMenu = (e) => {
    // Check if the click event originated from inside the side menu content
    if (e.currentTarget !== e.target) {
      return; // If it did, then ignore the click and return
    }

    setIsExpanded(!isExpanded);
  };

  function handleOnDragEnd(result) {
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

  function handleOnDragStart(start) {}

  const onFileUpload = (extractedColumns, uploadedFile) => {
    setExtractedColumns(extractedColumns);
    setToggleColumns(true);
    setFile(uploadedFile);
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

  const handleSubmit = async () => {
    setIsLoading(true);

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
    } catch (err) {}
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
    <div
      className={`side-menu ${isExpanded ? "collapsed" : "expanded"}`}
      onClick={toggleMenu}
    >
      <div className="side-menu-content">
        <div className="file-div">
          <FileDropComponent onFileUpload={onFileUpload} />
        </div>
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onDragStart={handleOnDragStart}
        >
          <div
            className="column-section"
            style={{ display: toggleColumns ? "flex" : "none" }}
          >
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
                            <svg
                              width="20px"
                              height="20px"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#55555555"
                              className="bi bi-three-dots-vertical"
                            >
                              <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                              <path d="M12.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
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
            <div className="input-cols">
              <div className="zipcode-col">
                <h4>Zipcode Column</h4>
                <Droppable droppableId="zipcodeList">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list zipcode-list"
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
                                <svg
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#55555555"
                                  className="bi bi-three-dots-vertical"
                                >
                                  <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                  <path d="M12.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
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
                <h4>Main Data Column</h4>
                <Droppable droppableId="mainDataList">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list zipcode-list"
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
                                <svg
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#55555555"
                                  className="bi bi-three-dots-vertical"
                                >
                                  <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                  <path d="M12.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
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
              <div className="sec-data-col">
                <h4>Secondary Data Columns</h4>
                <Droppable droppableId="secDataList">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list sec-data-list"
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
                                <svg
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#55555555"
                                  className="bi bi-three-dots-vertical"
                                >
                                  <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                  <path d="M12.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
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
          </div>
        </DragDropContext>
        <div
          className="final-section"
          style={{ display: buttonVis ? "flex" : "none" }}
        >
          <h4 className="input-label">File Prefix</h4>
          <input
            type="text"
            value={prefix}
            onChange={(e) => {
              setPrefix(e.target.value);
            }}
            className="text-input"
          ></input>
          <button onClick={handleSubmit} className="submit-btn">
            Generate Heatmap
          </button>
          {isLoading && <LoadingMessage />}
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
              <p className="blue-text">Copy Link</p>
              <svg
                fill="#1897d3"
                height="20px"
                width="20px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 488.3 488.3"
                className="copy-btn"
              >
                <g>
                  <g>
                    <path
                      d="M314.25,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124
			C352.75,102.7,335.45,85.4,314.25,85.4z M325.75,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124
			c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"
                    />
                    <path
                      d="M401.05,0h-227c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227
			c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6
			V38.6C439.65,17.3,422.35,0,401.05,0z"
                    />
                  </g>
                </g>
              </svg>
            </div>
            <div className="download-section">
              <a onClick={handleDownload} style={{ cursor: "pointer" }}>
                Download File
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="tab" onClick={toggleMenu}>
        {" "}
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={toggleMenu}
          className="mini-btn"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />

          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            {" "}
            <circle
              opacity="0.5"
              cx="12"
              cy="12"
              r="10"
              stroke="#ffffff"
              strokeWidth="1.5"
            />{" "}
            <path
              id="horizontalLine"
              d="M15 12H9"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />{" "}
            <path
              id="verticalLine"
              d="M11 15V9"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`${isExpanded ? "minus" : ""}`}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default InputSection;
