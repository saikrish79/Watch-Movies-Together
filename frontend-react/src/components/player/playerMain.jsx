import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import PreVideoSetupComp from "./preVideoSetupComp";
import VideoPlayer from "./videoPlayer";
import md5 from "md5";
import {
  useUserStore,
  useRoomStore,
  useConnectionStore,
} from "../../store/store";

function PlayerMain(props, ref) {
  const [isVideoSrcSelected, setIsVideoSrcSelected] = useState(false);
  const [isFileSelectedByHost, setIsFileSelectedByHost] = useState(false);
  const [fileDetails, setFileDetails] = useState({});
  const [videoSrc, setVideoSrc] = useState({});
  const [hostFileDetails, setHostFileDetails] = useState({});
  const [playerAction, setPlayerAction] = useState({});

  const actionNotificaitonRef = useRef();
  const playerRef = useRef(null);

  const user = useUserStore((state) => state.user);
  const isUserRoomHost = useUserStore((state) => state.user.isUserRoomHost);
  const room = useRoomStore((state) => state.room);
  const playerChannel = useConnectionStore((state) => state.playerChannel);

  const intervalID = useRef("");
  //console.log(intervalID.current);

  useImperativeHandle(ref, () => ({
    onPlayerActionMessage: (data) => {
      handleReceivedAction(data);
    },
  }));

  useEffect(() => {
    if (intervalID.current !== "") clearInterval(intervalID.current);
    //console.log("Keep in sync activated");
    keepInSync();
    intervalID.current = setInterval(keepInSync, 3000);
  }, [playerChannel, isVideoSrcSelected, isUserRoomHost]);

  function keepInSync() {
    if (
      isUserRoomHost &&
      playerRef.current !== null &&
      typeof playerRef.current.getPlayerInfo() !== "undefined"
    ) {
      //console.log(playerRef.current.getPlayerInfo());
      handleSendAction(
        "updatePlayerFromHost",
        playerRef.current.getPlayerInfo()
      );
    }
  }

  const handleReceivedAction = async (playerActionData) => {
    //console.log({ playerActionData });

    switch (playerActionData.action) {
      case "play":
        if (playerRef.current !== null) {
          playerRef.current.play();
          showNotification(
            playerActionData.fromUser.name + " played the video..."
          );
        }
        break;
      case "pause":
        if (playerRef.current !== null) {
          playerRef.current.pause();
          showNotification(
            playerActionData.fromUser.name + " paused the video..."
          );
        }
        break;
      case "ff3":
        if (playerRef.current !== null) {
          playerRef.current.ff3();
          showNotification(
            playerActionData.fromUser.name +
              " fast forwarded the video for 3 secs..."
          );
        }
        break;
      case "rw3":
        if (playerRef.current !== null) {
          playerRef.current.rw3();
          showNotification(
            playerActionData.fromUser.name + " rewinded the video for 3 secs..."
          );
        }
        break;
      case "ff30":
        if (playerRef.current !== null) {
          playerRef.current.ff30();
          showNotification(
            playerActionData.fromUser.name +
              " fast forwarded the video for 30 secs..."
          );
        }
        break;
      case "rw30":
        if (playerRef.current !== null) {
          playerRef.current.rw30();
          showNotification(
            playerActionData.fromUser.name +
              " rewinded the video for 30 secs..."
          );
        }
        break;
      case "newHostFileSelect":
        setIsFileSelectedByHost(true);
        setHostFileDetails(playerActionData.data);
        break;
      case "getRoomSessionDetails":
        if (isUserRoomHost) {
          const msg = {
            fromUser: user.ID,
            action: "updateRoomSessionDetails",
            data: {
              isFileSelectedByHost: isVideoSrcSelected,
              hostFileDetails: fileDetails,
            },
          };
          playerChannel[playerActionData.fromUser.ID].send(JSON.stringify(msg));
        }
        break;
      case "updateRoomSessionDetails":
        setIsFileSelectedByHost(playerActionData.data.isFileSelectedByHost);
        setHostFileDetails(playerActionData.data.hostFileDetails);
        break;
      case "syncPlayerFromHost":
        if (isUserRoomHost && playerRef.current !== null) {
          //console.log(playerRef.current.getPlayerInfo());
          const msg = {
            fromUser: user.ID,
            action: "updatePlayerFromHost",
            data: playerRef.current.getPlayerInfo(),
          };
          //console.log(playerRef.current.getPlayerInfo());
          playerChannel[playerActionData.fromUser.ID].send(JSON.stringify(msg));
        }
        break;
      case "updatePlayerFromHost":
        //console.log(playerActionData.data);
        if (playerRef.current !== null) {
          playerRef.current.updatePlayerFromHost({
            data: playerActionData.data,
          });
        }
        break;
      case "toggleHostMode":
        //console.log(playerActionData.data);
        if (playerRef.current !== null) {
          playerRef.current.onToggleHostMode();
        }
        break;
      default:
    }
  };

  const handleFileSelect = async (fileSrc) => {
    let URL = window.URL || window.webkitURL;
    let needToContinue = false;
    let obj = fileSrc.current;
    console.log(obj);
    let file = obj.files[0];
    let checkChunk = file.slice(0, 1024);
    let r = new FileReader();
    r.readAsText(checkChunk);
    r.onload = (e) => {
      const result = e.target.result;
      //console.log(result);
      //console.log(md5(result));
      const fileObj = {
        name: file.name,
        type: file.type,
        fileVerifyData: md5(result),
      };
      //console.log(fileObj);
      setFileDetails(fileObj);
      if (isUserRoomHost) {
        handleSendAction("newHostFileSelect", fileObj);
        needToContinue = true;
      } else {
        if (
          fileObj.name === hostFileDetails.name &&
          fileObj.type === hostFileDetails.type &&
          fileObj.fileVerifyData === hostFileDetails.fileVerifyData
        ) {
          needToContinue = true;
        } else {
          showNotification("Please select the same file as the host...");
        }
      }
      if (needToContinue) {
        let fileURL = URL.createObjectURL(file);
        setVideoSrc({ src: fileURL, type: file.type });
        setIsVideoSrcSelected(true);
      }
    };
  };

  const handleSendAction = (action, obj) => {
    //console.log("Handling Send Action");
    const msg = {
      fromUser: user,
      action: action,
      data: obj,
    };
    room.usersInRoom.forEach((_user) => {
      //console.log(_user.id + msg);
      if (playerChannel[_user.id].readyState === "open")
        playerChannel[_user.id].send(JSON.stringify(msg));
    });
  };

  const showNotification = (msg) => {
    props.onShowNotification(msg);
  };

  return (
    <div>
      {!isVideoSrcSelected && (
        <PreVideoSetupComp
          onSendAction={handleSendAction}
          isFileSelectedByHost={isFileSelectedByHost}
          hostFileDetails={hostFileDetails}
          onFileSelect={handleFileSelect}
        />
      )}
      {isVideoSrcSelected && (
        <VideoPlayer
          ref={playerRef}
          playerAction={playerAction}
          setPlayerAction={setPlayerAction}
          videoSrc={videoSrc}
          onSendAction={handleSendAction}
          isHost={isUserRoomHost}
        />
      )}
      <p ref={actionNotificaitonRef} className="col"></p>
    </div>
  );
}

export default React.forwardRef(PlayerMain);
