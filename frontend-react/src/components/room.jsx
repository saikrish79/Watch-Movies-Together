import React, { useState, useRef, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import RoomSession from "./roomSession";
import RoomDecision from "./roomDecision";
import { useUserStore, useRoomStore, useConnectionStore } from "../store/store";
import http from "../services/httpService";

function Room({ onWebSocketSend, wsConn }) {
  const user = useUserStore((state) => state.user);
  const isUserRoomHost = useUserStore((state) => state.user.isUserRoomHost);
  const setUserHost = useUserStore((state) => state.setUserHost);
  const [, setForceUpdate] = useState(Date.now());

  const room = useRoomStore((state) => state.room);
  const addUsers = useRoomStore((state) => state.addUsers);
  const updateAllUsersInRoom = useRoomStore(
    (state) => state.updateAllUsersInRoom
  );
  const updateUserInRoom = useRoomStore((state) => state.updateUserInRoom);
  const deleteUserInRoom = useRoomStore((state) => state.deleteUserInRoom);
  const resetRoom = useRoomStore((state) => state.resetRoom);

  const peerConnection = useConnectionStore((state) => state.peerConnection);
  const chatChannel = useConnectionStore((state) => state.chatChannel);
  const playerChannel = useConnectionStore((state) => state.playerChannel);
  const addConnections = useConnectionStore((state) => state.addConnections);
  const updateConnections = useConnectionStore(
    (state) => state.updateConnections
  );
  const refreshConnections = useConnectionStore(
    (state) => state.refreshConnections
  );
  const resetConnections = useConnectionStore(
    (state) => state.resetConnections
  );
  const [notifications, setNotifications] = useState([]);

  let PConn = {};
  let DC = {};
  let PC = {};

  const sessionRef = useRef();
  const navigate = useNavigate();
  const roomLinkRef = useRef();
  roomLinkRef.current = room;

  const isUserHostRef = useRef();
  isUserHostRef.current = isUserRoomHost;

  useEffect(() => {
    return () => {
      //console.log(roomLinkRef);
      handleRoomExit(false);
    };
  }, []);

  wsConn.onmessage = (content) => {
    // console.log("Message from Socket - " + content.data);
    const { data, event, fromUser, msg } = JSON.parse(content.data);

    switch (event) {
      case "offer":
        handleOffer(fromUser, data);
        break;
      case "answer":
        handleAnswer(fromUser, data);
        break;
      case "candidate":
        handleCandidate(fromUser, data);
        break;
      case "makeUserHost":
        setUserHost(true);
        break;
      case "newUser":
        {
          initializeUsers([fromUser]);
          PConn = {};
          DC = {};
          PC = {};
          //console.log(msg);
          let newUser = JSON.parse(msg);
          addUsers(newUser);
        }
        break;
      case "changeUserName":
        {
          //console.log(JSON.parse(msg));
          updateUserInRoom(JSON.parse(msg));
        }
        break;
      case "updateUsersList":
        {
          http
            .get(http.api + "/room/usersInRoom/" + user.ID + "/" + room.link)
            .then((response) => {
              //console.log(response.data);
              updateAllUsersInRoom(response.data);
            });
        }
        break;
      case "userExit":
        const _user = fromUser;
        let tempPConn = { ...peerConnection };
        delete tempPConn[_user];
        let tempDC = { ...chatChannel };
        delete tempDC[_user];
        let tempPC = { ...playerChannel };
        delete tempPC[_user];

        updateConnections(tempPConn, tempDC, tempPC);

        let notifyText = "User " + _user + " left the room";
        let newArr = [...notifications, notifyText];
        setNotifications(newArr);
        deleteUserInRoom(fromUser);
        setForceUpdate();
        break;
      default:
      //console.log("Inside default");
    }
  };

  const handleInitializeUsers = async (_userList) => {
    await initializeUsers(_userList);
  };

  const initializeUsers = async (usersList) => {
    //console.log("Inside initialize");
    usersList.forEach(async (_user) => {
      await initialize(_user);
    });
    //console.log(PConn);
    addConnections({ ...PConn }, { ...DC }, { ...PC });
    setForceUpdate();
  };

  const initialize = async (_user) => {
    const configuration = {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    };

    PConn[_user] = new RTCPeerConnection(configuration);

    PConn[_user].onicecandidate = function (event) {
      if (event.candidate) {
        //console.log(event.candidate);
        // console.log("Inside onicecandidate of user " + PConn[_user]);
        onWebSocketSend({
          event: "candidate",
          data: event.candidate,
          fromUser: user.ID,
          toUser: _user,
        });
      }
    };

    DC[_user] = PConn[_user].createDataChannel("chatChannel", {
      maxRetransmits: 7,
    });

    PC[_user] = PConn[_user].createDataChannel("playerChannel", {
      maxRetransmits: 7,
    });

    PConn[_user].ondatachannel = function (event) {
      // console.log(event);
      if (event.channel.label === "chatChannel") {
        DC[_user] = event.channel;
        DC[_user].onopen = handleDataChannelOpen;
        DC[_user].onmessage = handleDataChannelMessageReceived;
        DC[_user].onerror = handleDataChannelError;
        DC[_user].onclose = handleDataChannelClose;
      } else if (event.channel.label === "playerChannel") {
        PC[_user] = event.channel;
        PC[_user].onopen = handlePlayerChannelOpen;
        PC[_user].onmessage = handlePlayerChannelMessageReceived;
        PC[_user].onerror = handlePlayerChannelError;
        PC[_user].onclose = handlePlayerChannelClose;
      }
    };
    //console.log("Initialized peer connection for " + _user);
  };

  const handleDataChannelOpen = (event) => {
    //console.log("dataChannel.OnOpen", event);
    refreshConnections();
    //sessionRef.current.onChatNeedRender();
  };

  const handleDataChannelMessageReceived = (event) => {
    //console.log("dataChannel.OnMessage:", event);
    // setMessages((prevMsgs) => [...prevMsgs, JSON.parse(event.data)]);
    sessionRef.current.onChatMessage(JSON.parse(event.data));
  };

  const handleDataChannelError = (error) => {
    //console.log("dataChannel.OnError:", error);
  };

  const handleDataChannelClose = (event) => {
    //console.log("dataChannel.OnClose", event);
  };

  const handlePlayerChannelOpen = (event) => {
    //console.log("PlayerChannel.OnOpen", event);
  };

  const handlePlayerChannelMessageReceived = (event) => {
    //console.log("PlayerChannel.OnMessage:", event);
    if (roomLinkRef.current !== "")
      sessionRef.current.onPlayerActionMessage(JSON.parse(event.data));
  };

  const handlePlayerChannelError = (error) => {
    //console.log("PlayerChannel.OnError:", error);
  };

  const handlePlayerChannelClose = (event) => {
    //console.log("PlayerChannel.OnClose", event);
  };

  const createOffer = async (_user) => {
    return new Promise((res) => {
      //console.log("Inside Create Offer " + _user);
      peerConnection[_user].createOffer(
        async function (offer) {
          //console.log(offer);
          //console.log("Offer created for " + _user);
          wsConn.send(
            JSON.stringify({
              event: "offer",
              data: offer,
              fromUser: user.ID,
              toUser: _user,
            })
          );
          await peerConnection[_user].setLocalDescription(offer);
        },
        function (error) {
          alert("Error creating an offer");
        }
      );
    });
  };

  const handleOfferCreation = async (usersList) => {
    usersList.forEach(async (_user) => {
      if (
        peerConnection[_user].connectionState !== "connecting" &&
        peerConnection[_user].connectionState !== "connected"
      ) {
        await createOffer(_user);
      }
    });
  };

  const handleOffer = async (_user, offer) => {
    await peerConnection[_user].setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    //console.log("Handling offer for " + _user);
    await peerConnection[_user].createAnswer(
      async function (answer) {
        //console.log(answer);
        await peerConnection[_user].setLocalDescription(answer);
        onWebSocketSend({
          event: "answer",
          data: answer,
          fromUser: user.ID,
          toUser: _user,
        });
      },
      function (error) {
        //alert("Error creating an answer");
      }
    );
  };

  const handleCandidate = async (_user, candidate) => {
    //console.log("adding candidate object for " + _user);
    await peerConnection[_user].addIceCandidate(new RTCIceCandidate(candidate));
  };

  const handleAnswer = async (_user, answer) => {
    await peerConnection[_user].setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    //console.log("connection established successfully!!");
  };

  const handleRoomExit = useCallback(
    (flag = true) => {
      if (isUserHostRef.current) {
        onWebSocketSend({
          event: "makeAnotherUserHost",
          fromUser: user.ID,
          msg: roomLinkRef.current.link,
        });
      }
      onWebSocketSend({
        event: "userExit",
        fromUser: user.ID,
        msg: roomLinkRef.current.link,
      });
      http.get(http.api + "/room/exitRoom/" + user.ID).then((res) => {
        setUserHost(false);
        resetRoom();
        resetConnections();
      });
      if (flag) navigate("/room", { replace: true });
    },
    [room.link, user.ID]
  );

  return (
    <>
      <Routes>
        <Route
          index
          path="/roomDecision"
          element={
            <RoomDecision
              onInitializeUsers={handleInitializeUsers}
              onHandleOfferCreation={handleOfferCreation}
              onWebSocketSend={onWebSocketSend}
            />
          }
        />
        <Route
          path=":roomID"
          element={
            <RoomSession
              onWebSocketSend={onWebSocketSend}
              onHandleOfferCreation={handleOfferCreation}
              onRoomExit={handleRoomExit}
              ref={sessionRef}
              wsConn={wsConn}
            />
          }
        />
        <Route path="/*" element={<Navigate to="/room/roomDecision" />}></Route>
      </Routes>
    </>
  );
}

export default Room;
