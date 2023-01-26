import React, { useRef, useEffect, useImperativeHandle } from "react";
import { useParams, Navigate } from "react-router-dom";
import ChatBox from "./chatBox";
import PlayerMain from "./player/playerMain";
import UserList from "./userList";
import http from "../services/httpService";
import { useUserStore, useRoomStore } from "../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

function RoomSession(props, ref) {
  const { roomID } = useParams();
  const isOfferCreated = useRef(false);
  const room = useRoomStore((state) => state.room);
  const user = useUserStore((state) => state.user);
  const changeUserName = useUserStore((state) => state.changeUserName);
  const actionNotificaitonRef = useRef();
  const chatRef = useRef();
  const playerActionRef = useRef();

  useImperativeHandle(ref, () => ({
    onPlayerActionMessage: (data) => {
      //console.log(data);
      playerActionRef.current.onPlayerActionMessage(data);
    },
    onChatMessage: (data) => {
      //console.log(data);
      chatRef.current.onChatMessage(data);
    },
    onChatNeedRender: () => {
      chatRef.current.onChatNeedRender();
    },
  }));

  useEffect(() => {
    let userNameAlreadyPresent = room.usersInRoom.some(
      (_user) => _user.name === user.name
    );
    //console.log(userNameAlreadyPresent);

    if (userNameAlreadyPresent) {
      handleShowNotification(
        "User name already exists in the room. So its altered. Please go to Home to change to a different ones if needed."
      );
      let temp = user.name + "_" + user.ID.slice(7);
      changeUserName(temp);
      http
        .post(http.api + "/user/changeUserName/" + user.ID + "/" + temp)
        .then((response) => {
          props.onWebSocketSend({
            event: "changeUserName",
            fromUser: user.ID,
            msg: room.link,
          });
        });
    }
    peerSetup();
    async function peerSetup() {
      if (!isOfferCreated.current) {
        let usersIDInRoom = room.usersInRoom.map((u) => {
          return u.id;
        });
        await props.onHandleOfferCreation(usersIDInRoom).then(() => {
          isOfferCreated.current = true;
        });
      }
    }
  }, []);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } //else {
    // return document.execCommand("copy", true, text);
    // }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(roomID)
      .then(() => {
        handleShowNotification("Room ID Copied successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    //console.log("Room session rendered");
  });

  const handleShowNotification = (msg) => {
    actionNotificaitonRef.current.innerHTML = msg;
    setTimeout(() => {
      actionNotificaitonRef.current.innerHTML = "";
    }, 3000);
  };

  if (!room.isRoomCreated) {
    return <Navigate to="/room" replace />;
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row m-3 container-fluid">
          <div
            className="col-8 card-sm alert alert-primary text-center shadow-sm mx-1 mb-0"
            style={{ minHeight: 1 + "em" }}
          >
            <p ref={actionNotificaitonRef} className="card-text"></p>
          </div>
          <div
            onClick={handleCopyClick}
            className="col align-self-center text-center shadow-sm"
            style={{ minHeight: 4 + "em" }}
          >
            <div className="card-sm m-0">
              <div className="card-body">
                <h6 className="card-title">Room ID</h6>
                <p className="card-text">
                  {roomID} <FontAwesomeIcon icon={faClipboard} />
                </p>
              </div>
            </div>
          </div>
          <div
            className="col card-sm m-2 shadow-sm"
            style={{ minHeight: 4 + "em" }}
          >
            <button
              className="btn btn-danger position-relative top-50 start-50 translate-middle"
              onClick={props.onRoomExit}
            >
              Exit Room
            </button>
          </div>
        </div>
        <div className="row m-3">
          <div className="col-9 card m-4 shadow-sm border">
            {
              <PlayerMain
                onShowNotification={handleShowNotification}
                ref={playerActionRef}
              />
            }
          </div>
          <div className="col card m-3 shadow-sm border">
            <ChatBox ref={chatRef} wsConn={props.wsConn} />
          </div>
        </div>
        <div className="row mt-1 m-3 p-3">
          <UserList />
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(RoomSession);
