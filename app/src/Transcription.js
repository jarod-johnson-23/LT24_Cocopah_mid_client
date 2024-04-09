import "./Transcription.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import { API_BASE_URL } from "./config";
import FileDropComponent from "./components/FileDropComponent";

function Transcription() {
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speakerSection, setSpeakerSection] = useState(false);
  const [transcriptFilename, setTranscriptFilename] = useState("");
  const [speakersSummary, setSpeakersSummary] = useState({});
  const [speakerNames, setSpeakerNames] = useState({});

  const onAudioFileUpload = (extractedColumns, uploadedFile) => {
    setAudioFile(uploadedFile);
  };

  const handleSpeakerNameChange = (speakerKey, newName) => {
    setSpeakerNames((prevNames) => ({
      ...prevNames,
      [speakerKey]: newName, // Update the name for the specific speaker key
    }));
  };

  const transcribeAudio = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (audioFile) {
      if (audioFile.type === "audio/mpeg") {
        formData.append("audio_input", audioFile);
      } else {
        alert("Only MP3 file are allowed at the moment");
        return 0;
      }
    } else {
      return 0;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transcription/mp3`,
        formData
      );

      setTranscriptFilename(response.data.filename);
      setSpeakersSummary(response.data.speakers);
    } catch (error) {
      console.error("There was an error uploading the data:", error);
    } finally {
      setIsLoading(false);
      const initialSpeakerNames = {};
      Object.keys(speakersSummary).forEach((speakerKey) => {
        initialSpeakerNames[speakerKey] = speakerKey; // Initially, key is the same as value
      });
      setSpeakerNames(initialSpeakerNames);
      setSpeakerSection(true);
    }
  };

  const updateSpeakers = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transcription/add_speakers_and_send`,
        {
          filename: transcriptFilename,
          speaker_names: speakerNames,
        },
        {
          responseType: "blob",
        }
      );

      // Creating a URL for the blob
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));

      // Creating a temporary link element
      const fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", transcriptFilename); // or another filename you want
      document.body.appendChild(fileLink);

      fileLink.click(); // Simulate click on the link to start download

      document.body.removeChild(fileLink); // Clean-up
    } catch (error) {
      console.error("There was an error uploading the data:", error);
    } finally {
      return 1;
    }
  };

  return (
    <>
      <Navbar />
      <div className="script-main-div">
        <div className="script-main-content">
          <div className="toyota-file-drop">
            <FileDropComponent
              onFileUpload={onAudioFileUpload}
              className="file-area"
            />
            <div className="script-second-content">
              <button className="transcript-btn" onClick={transcribeAudio}>
                Transcribe Audio
              </button>
            </div>
          </div>
          <div className="script-third-content">
            {!isLoading && !speakerSection && (
              <div className="script-description-section">
                <h2>Audio Transcription Service</h2>
                <p>
                  This tool is used to convert an mp3 audio file into a
                  transcript. File processing may take multiple minutes to an
                  hour depending on file size. Once the file is processed, edit
                  the generated speaker names based on the first 3 spoken lines
                  from a given speaker.
                </p>
              </div>
            )}
            {isLoading && <div className="spinner"></div>}
            {speakerSection && (
              <div className="script-speaker-section">
                {Object.entries(speakersSummary).map(
                  ([speakerKey, lines], index) => (
                    <div key={index} className="speaker-summary">
                      <input
                        type="text"
                        defaultValue={speakerKey}
                        onChange={(e) =>
                          handleSpeakerNameChange(speakerKey, e.target.value)
                        }
                      />
                      <p>{lines}</p>
                    </div>
                  )
                )}
              </div>
            )}
            {speakerSection && (
              <button
                className="transcript-btn right-side-btn"
                onClick={updateSpeakers}
              >
                Submit Speakers
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Transcription;
