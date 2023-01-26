import React, { useRef, useEffect, useMemo } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./customVideo.css";

function VideoJS(props) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;
      const player = (playerRef.current = videojs(videoElement, options, () => {
        //videojs.log("player is ready");
        onReady && onReady(player);
      }));
    } else {
      //console.log("else block of config");
      const player = playerRef.current;
      onReady(player);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="container">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered customVideo"
      />
    </div>
  );
}

function MemoizedVideoComponent(props) {
  return useMemo(() => {
    return <VideoJS options={props.options} onReady={props.onReady} />;
  }, [props.videoJsOptions, props.handlePlayerReady]);
}

export default MemoizedVideoComponent;
