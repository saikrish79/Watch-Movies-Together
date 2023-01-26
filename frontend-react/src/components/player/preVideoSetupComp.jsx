import React, { useRef } from "react";
import sampleVideo from "../../resources/SampleVideo_1280x720_10.mp4";
import { useUserStore } from "../../store/store";
import "./preVideoSetupComp.css";

function PreVideoSetupComp(props) {
  const { onSendAction, isFileSelectedByHost, onFileSelect, hostFileDetails } =
    props;
  const isUserRoomHost = useUserStore((state) => state.user.isUserRoomHost);
  const isSynced = useRef(false);
  const fileSrc = useRef();

  const checkIfRoomInSession = () => {
    if (!isUserRoomHost) {
      isSynced.current = true;
      onSendAction("getRoomSessionDetails");
    }
  };

  const onFileSelectLocal = () => {
    onFileSelect(fileSrc);
  };

  return (
    <div className="d-flex justify-content-center setupDiv">
      {!isUserRoomHost && !isSynced.current && (
        <div className="text-center">
          <div className="row d-flex justify-content-center">
            <button
              onClick={checkIfRoomInSession}
              className="row m-3 p-3 btn btn-success d-flex justify-content-center"
            >
              Sync Now
            </button>
          </div>
          <p className="row m-3 p-3 d-flex justify-content-center">
            Sync your room with other users in the room.
          </p>
        </div>
      )}
      {!isUserRoomHost && isSynced.current && !isFileSelectedByHost && (
        <div className="text-center">
          <h2>Host hasn't selected any files yet!:( </h2>
          <h3>Kindly request the room host to select a file...</h3>
          <p>You can use the chat to talk with your roommates</p>
        </div>
      )}
      {((!isUserRoomHost && isSynced.current && isFileSelectedByHost) ||
        isUserRoomHost) && (
        <div>
          <div className="row">
            <div className="col d-flex justify-content-center m-3 p-3">
              {!isUserRoomHost && (
                <div className="text-center">
                  <p>
                    Please select a file as same as the host...
                    <br></br> The host has selected : Filename -
                    {hostFileDetails.name} of Type - {hostFileDetails.type}
                  </p>
                </div>
              )}
              {isUserRoomHost && "Please select a file..."}
            </div>
          </div>
          <div className="row">
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                id="inputGroupFile02"
                ref={fileSrc}
                accept="video/*"
                onChange={onFileSelectLocal}
              />
              <label className="input-group-text" htmlFor="inputGroupFile02">
                Select
              </label>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="card text-center mt-3">
              <div className="card-body">
                <h5 className="card-title">Sample Video</h5>
                <p className="card-text">Click to download a sample video</p>
                <a
                  className="btn btn-primary"
                  href={sampleVideo}
                  target="_blank"
                  download="SampleVideo_1280x720_10mb.mp4"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreVideoSetupComp;
