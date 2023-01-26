import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { useUserStore, useRoomStore } from "../store/store";
import http from "../services/httpService";
import "../css/roomDecision.css";

export default function RoomDecision(props) {
  const user = useUserStore((state) => state.user);
  const setUserHost = useUserStore((state) => state.setUserHost);
  const room = useRoomStore((state) => state.room);
  const createRoom = useRoomStore((state) => state.createRoom);
  const [showJoinComponent, setshowJoinComponent] = useState(false);
  const navigate = useNavigate();
  const errorRef = useRef("");
  const inputRef = useRef("");

  const handleNewRoomRequest = () => {
    http.get(http.api + "/room/createRoom/" + user.ID).then((response) => {
      // console.log(response.data);
      const room_ID = response.data;
      createRoom({
        link: room_ID,
        isRoomCreated: true,
        usersInRoom: [],
        isUserRoomHost: true,
      });
      setUserHost(true);
      navigate("/room/" + room_ID, { replace: true });
    });
  };

  const checkRoomLink = () => {
    if (inputRef.current.value !== "") {
      let roomLink = inputRef.current.value;
      http
        .get(http.api + "/room/checkIfRoomExists/" + roomLink)
        .then((response) => {
          //console.log(response);
          if (response.data) handleJoinRoomRequest();
          else {
            errorRef.current.innerHTML = "Please enter a correct Room Link";
            setTimeout(() => {
              errorRef.current.innerHTML = "";
            }, 4000);
          }
        });
    }
  };

  const handleJoinRoomRequest = async () => {
    if (inputRef.current.value !== "") {
      let roomLink = inputRef.current.value;
      http
        .get(http.api + "/room/joinRoom/" + user.ID + "/" + roomLink)
        .then(async (response) => {
          //console.log(response.data);
          createRoom({
            link: roomLink,
            isRoomCreated: true,
            usersInRoom: response.data,
            isUserRoomHost: false,
          });
          // console.log("Notify other users");
          props.onWebSocketSend({
            event: "newUserRequest",
            fromUser: user.ID,
            msg: roomLink,
          });
          let usersIDInRoom = response.data.map((u) => {
            return u.id;
          });
          //console.log(usersIDInRoom);
          await props.onInitializeUsers(usersIDInRoom);
          //console.log(peerConnection);
          navigate("/room/" + roomLink, { replace: true });
        });
    }
  };

  if (room.isRoomCreated) {
    const url = "/room/" + room.link;
    //console.log("from room decision");
    //console.log(url);
    return <Navigate to={url} />;
  }

  return (
    <div className="bg-white baseBox">
      <div className="container bg-light shadow p-7 bg-body rounded decisionBox align-items-center justify-content-center">
        <div className="row">
          <div className="col-12 m-6 mb-4 text-center fs-4">
            <p>
              What do you wanna do...?
              <FontAwesomeIcon bounce fixedWidth icon={faChampagneGlasses} />
            </p>
          </div>
        </div>
        <div className="row m-3 p-3">
          <div className="col d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={handleNewRoomRequest}
            >
              Create Room
            </button>
          </div>
          <div className="col d-flex justify-content-center">
            <p className="m-auto">Click to create a new room</p>
          </div>
        </div>
        <div className="row mt-6 m-3 p-3">
          <div className="col d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary m-2"
              data-bs-toggle="button"
              onClick={() =>
                setshowJoinComponent((showJoinComponent) => !showJoinComponent)
              }
            >
              Join Room
            </button>
          </div>
          <div className="col d-flex justify-content-center">
            {!showJoinComponent && (
              <p className="m-auto">Click to join an existing room</p>
            )}
            {showJoinComponent && (
              <div className="col d-flex justify-content-center">
                {/* <input
                  type="text"
                  className="form-control-sm"
                  placeholder="Enter a link to join"
                  ref={inputRef}
                />
                <button
                  className="btn btn-primary m-2 d-flex justify-content-center inline"
                  onClick={checkRoomLink}
                >
                  Join Room
                </button> */}
                <div className="input-group mb-3">
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    placeholder="Room link"
                    aria-label="Room link"
                    aria-describedby="button-addon2"
                  />
                  <button
                    style={{ display: "inline" }}
                    className="btn btn-outline-primary"
                    type="button"
                    id="button-addon2"
                    onClick={checkRoomLink}
                  >
                    Join
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="row text-right">
          <p className="col mt-6 p-3 text-danger " ref={errorRef}></p>
        </div>
      </div>
    </div>
  );
}
