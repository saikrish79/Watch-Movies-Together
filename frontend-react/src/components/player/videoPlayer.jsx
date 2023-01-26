import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import VideoJS from "./videoJS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeDown,
  faForward,
  faBackward,
  faFastForward,
  faFastBackward,
  faCircleH,
} from "@fortawesome/free-solid-svg-icons";

const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const { videoSrc, onSendAction, isHost } = props;
  const playerStatus = useRef({
    isPlaying: false,
    currentTime: 0,
    hostMode: false,
  });
  const [borderColor, setBorderColor] = useState("red");
  const timeOutId = useRef();
  const [isHostModeActive, setIsHostModeActive] = useState(false);
  const hostRef = useRef();

  useEffect(() => {
    //console.log(isHost);
    clearTimeout(timeOutId.current);
    if (isHost) setBorderColor("green");
  }, [isHost]);

  useImperativeHandle(ref, () => ({
    play: () => {
      playVideo(false);
    },
    pause: () => {
      pauseVideo(false);
    },
    ff3: () => {
      FF3(false);
    },
    rw3: () => {
      RW3(false);
    },
    ff30: () => {
      FF30(false);
    },
    rw30: () => {
      RW30(false);
    },
    getPlayerInfo: () => {
      return handleGetPlayerInfo();
    },
    updatePlayerFromHost: (status) => {
      handleUpdatePlayerFromHost(status);
    },
    onToggleHostMode: () => {
      handleToggleHostMode();
    },
  }));

  const handlePlayerReady = useCallback(
    (player) => {
      videoRef.current = player;

      player.on("waiting", () => {
        //console.log("player is waiting");
      });

      player.on("dispose", () => {
        //console.log("player will dispose");
      });
    },
    [videoSrc]
  );

  const handlePlayVideo = () => {
    playVideo(true);
  };

  const handlePauseVideo = () => {
    pauseVideo(true);
  };

  const handleVolumeUp = () => {
    volumeUp();
  };

  const handleVolumeDown = () => {
    volumeDown();
  };

  const handleFF3 = () => {
    FF3(true);
  };

  const handleRW3 = () => {
    RW3(true);
  };

  const handleFF30 = () => {
    FF30(true);
  };

  const handleRW30 = () => {
    RW30(true);
  };

  const playVideo = (val) => {
    if (videoRef.current !== null) {
      videoRef.current.play();
      if (val) onSendAction("play");
    }
  };

  const pauseVideo = (val) => {
    if (videoRef.current !== null) {
      videoRef.current.pause();
      if (val) onSendAction("pause");
    }
  };

  const volumeUp = () => {
    if (videoRef.current !== null) {
      let howLoudIsIt = videoRef.current.volume();
      //console.log(howLoudIsIt);
      if (howLoudIsIt < 1) videoRef.current.volume(howLoudIsIt + 0.1);
    }
  };

  const volumeDown = () => {
    if (videoRef.current !== null) {
      let howLoudIsIt = videoRef.current.volume();
      //console.log(howLoudIsIt);
      if (howLoudIsIt > 0) videoRef.current.volume(howLoudIsIt - 0.1);
    }
  };

  const FF3 = (val) => {
    if (videoRef.current !== null) {
      let lengthOfVideo = videoRef.current.duration();
      let whereYouAt = videoRef.current.currentTime();
      if (lengthOfVideo >= whereYouAt + 4) {
        videoRef.current.currentTime(whereYouAt + 3);
        if (val) onSendAction("ff3");
      }
    }
  };

  const RW3 = (val) => {
    if (videoRef.current !== null) {
      let whereYouAt = videoRef.current.currentTime();
      if (whereYouAt - 4 > 0) {
        videoRef.current.currentTime(whereYouAt - 3);
        if (val) onSendAction("rw3");
      }
    }
  };

  const FF30 = (val) => {
    if (videoRef.current !== null) {
      let lengthOfVideo = videoRef.current.duration();
      let whereYouAt = videoRef.current.currentTime();
      if (lengthOfVideo >= whereYouAt + 31) {
        videoRef.current.currentTime(whereYouAt + 30);
        if (val) onSendAction("ff30");
      }
    }
  };

  const RW30 = (val) => {
    if (videoRef.current !== null) {
      let whereYouAt = videoRef.current.currentTime();
      if (whereYouAt - 31 >= 0) {
        videoRef.current.currentTime(whereYouAt - 30);
        if (val) onSendAction("rw30");
      }
    }
  };

  function handleGetPlayerInfo() {
    if (videoRef.current !== null) {
      playerStatus.current = {
        isPlaying: !videoRef.current.paused(),
        currentTime: videoRef.current.currentTime(),
        hostMode: isHostModeActive,
      };
      return playerStatus.current;
    }
  }

  const toggleHostMode = () => {
    onSendAction("toggleHostMode");
    handleToggleHostMode();
    // if (hostRef.current.innerHTML === "")
    //   hostRef.current.innerHTML = "Host Mode Active";
    // else hostRef.current.innerHTML = "";
  };

  const handleToggleHostMode = () => {
    //console.log("Inside peers toggle - " + isHostModeActive);
    if (!isHostModeActive) {
      setIsHostModeActive(true);
      hostRef.current.innerHTML = "Host Mode Active";
    } else {
      setIsHostModeActive(false);
      hostRef.current.innerHTML = "";
    }
  };

  const handleUpdatePlayerFromHost = (status) => {
    if (videoRef.current !== null) {
      // console.log(status);
      playerStatus.current = {
        isPlaying: status.data.isPlaying,
        currentTime: status.data.currentTime,
        hostMode: status.data.hostMode,
      };
      videoRef.current.currentTime(playerStatus.current.currentTime);
      if (playerStatus.current.isPlaying) {
        videoRef.current.play();
      }
      //console.log(playerStatus.current.hostMode);
      if (isHostModeActive !== playerStatus.current.hostMode)
        handleToggleHostMode();
      // console.log(playerStatus.current);
      if (!isHost) showInSyncBorder();
    }
  };

  const showInSyncBorder = () => {
    setBorderColor("green");
    // console.log(timeOutId.current);
    clearTimeout(timeOutId.current);
    timeOutId.current = setTimeout(() => {
      setBorderColor("red");
    }, 7000);
  };

  let videoJsOptions = {
    autoplay: false,
    controls: false,
    responsive: false,
    fluid: true,
    fill: false,
    preload: "auto",
    muted: false,
    sources: [
      {
        src: videoSrc["src"],
        type: videoSrc["type"],
      },
    ],
  };

  return (
    <div
      style={{
        minHeight: 600 + "px",
      }}
    >
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div
        style={{
          border: "2px solid " + borderColor,
          borderRadius: "7px",
          margin: "3px auto",
        }}
        className="container btn-group btn-group-sm p-2 mt-2"
        role="group"
      >
        <button
          onClick={handlePlayVideo}
          className="btn btn-outline-success"
          disabled={!isHost && isHostModeActive}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button
          onClick={handlePauseVideo}
          className="btn btn-outline-success"
          disabled={!isHost && isHostModeActive}
        >
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button onClick={handleVolumeUp} className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faVolumeHigh} />
        </button>
        <button onClick={handleVolumeDown} className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faVolumeDown} />
        </button>
        <button
          onClick={handleFF3}
          className="btn btn-outline-success"
          disabled={!isHost && isHostModeActive}
        >
          <FontAwesomeIcon icon={faForward} />
          {" 3s "}
        </button>
        <button
          onClick={handleRW3}
          className="btn btn-outline-success"
          disabled={!isHost && isHostModeActive}
        >
          <FontAwesomeIcon icon={faBackward} />
          {" 3s "}
        </button>
        <button
          onClick={handleFF30}
          className="btn btn-outline-success"
          disabled={!isHost && isHostModeActive}
        >
          <FontAwesomeIcon icon={faFastForward} />
          {" 30s "}
        </button>
        <button
          onClick={handleRW30}
          className="btn btn-outline-success"
          disabled={!isHost && isHostModeActive}
        >
          <FontAwesomeIcon icon={faFastBackward} />
          {" 30s "}
        </button>
        {isHost && (
          <button onClick={toggleHostMode} className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faCircleH} />
            {" Host Mode "}
          </button>
        )}
      </div>
      <p ref={hostRef} className="text-muted text-warning text-center"></p>
    </div>
  );
});

export default VideoPlayer;
