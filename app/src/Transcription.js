import "./Transcription.css";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { useParams } from "react-router-dom";
import FileDropComponent from "./components/FileDropComponent";

function Transcription() {
  const [email, setEmail] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [speakerSection, setSpeakerSection] = useState(false);
  const [transcriptFilename, setTranscriptFilename] = useState("");
  const [speakersSummary, setSpeakersSummary] = useState({});
  const [speakerNames, setSpeakerNames] = useState({});
  const [fileSent, setFileSent] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  let { file_id } = useParams();

  const onAudioFileUpload = (extractedColumns, uploadedFile) => {
    setAudioFile(uploadedFile);
    setFileUploaded(true);
  };

  const handleSpeakerNameChange = (speakerKey, newName) => {
    setSpeakerNames((prevNames) => ({
      ...prevNames,
      [speakerKey]: newName, // Update the name for the specific speaker key
    }));
  };

  const transcribeAudio = async () => {
    const formData = new FormData();
    if (audioFile) {
      if (audioFile.type === "audio/mpeg") {
        formData.append("audio_input", audioFile);
        formData.append("email", email);
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
    } catch (error) {
      console.error("There was an error uploading the data:", error);
    } finally {
      // const initialSpeakerNames = {};
      // Object.keys(speakersSummary).forEach((speakerKey) => {
      //   initialSpeakerNames[speakerKey] = speakerKey; // Initially, key is the same as value
      // });
      // setSpeakerNames(initialSpeakerNames);
      // setSpeakerSection(true);
      setFileSent(true);
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

  useEffect(() => {
    setEmail(localStorage.getItem("user_email"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="script-main-div">
        <div className="script-main-content">
          {file_id === "upload" ? (
            <div className="script-holder">
              <div className="toyota-file-drop">
                <FileDropComponent
                  onFileUpload={onAudioFileUpload}
                  className="file-area"
                />
                <div className="script-second-content">
                  <button
                    className={`transcript-btn ${
                      fileUploaded ? "" : "script-disabled"
                    }`}
                    onClick={transcribeAudio}
                  >
                    Transcribe Audio
                  </button>
                </div>
              </div>
              <div className="script-third-content">
                {!fileSent ? (
                  <div className="script-description-section">
                    <h2>Audio Transcription Service</h2>
                    <p>
                      This tool is used to convert an mp3 audio file into a
                      transcript. File processing may take multiple minutes to
                      an hour depending on file size. Once the file is
                      processed, edit the generated speaker names based on the
                      first 3 spoken lines from a given speaker.
                    </p>
                  </div>
                ) : (
                  <div className="script-description-section">
                    <h2>Success!</h2>
                    <p>
                      Your file was uploaded successfully. An email will be sent
                      to the address associated with your account when the file
                      is done processing. Follow the link in the email to
                      complete step 2 of this process.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="script-holder-2">
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
          )}
        </div>
      </div>
    </>
  );
}

export default Transcription;
