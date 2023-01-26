import React, { useEffect, useRef, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import http from "./services/httpService";
import NavBar from "./components/navbar";
import Home from "./components/home";
import Room from "./components/room";
import UserPage from "./components/userPage";
import Footer from "./components/footer";
import { useUserStore } from "./store/store";
import "./css/App.css";
import HowTo from "./components/howto";

const wsConn = new WebSocket(http.websocketApi);

export default function App() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.createUser);
  const timeoutCount = useRef(0);
  const timeoutID = useRef(0);

  useEffect(() => {
    http.get(http.api + "/user/newUser").then((response) => {
      //console.log(response);
      const { id, name, isAuthenticated } = response.data;
      setUser({
        ID: id,
        name: name,
        isAuthenticated: isAuthenticated,
        isUserRoomHost: false,
      });
      webSocketSend({ event: "newUserSession", fromUser: id });
    });

    return () => {
      http.get(http.api + "/user/removeUser/" + user.ID).then((res) => {});
    };
  }, []);

  const webSocketSend = useCallback(
    (content) => {
      if (wsConn.readyState) {
        //console.log("socket send - " + JSON.stringify(content));
        wsConn.send(JSON.stringify(content));
        timeoutCount.current = 0;
        clearTimeout(timeoutID);
      } else if (timeoutCount.current < 7) {
        clearTimeout(timeoutID);
        timeoutID.current = setTimeout(webSocketSend, 1500, content);
        timeoutCount.current++;
      } else {
        timeoutCount.current = 0;
        clearTimeout(timeoutID);
      }
    },
    [wsConn]
  );

  wsConn.onopen = (msg) => {
    //console.log(msg);
  };

  wsConn.onerror = (msg) => {
    //console.log(msg);
  };

  return (
    <>
      <NavBar />
      <main className="flex-shrink-0">
        <div className="container-fluid">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/howto" element={<HowTo />} />
            <Route
              path="/userPage"
              element={<UserPage onWebSocketSend={webSocketSend} />}
            />
            <Route
              path="/room/*"
              element={<Room onWebSocketSend={webSocketSend} wsConn={wsConn} />}
            />
            <Route path="*" element={<Navigate to="/home" replace />}></Route>
          </Routes>
        </div>
      </main>
    </>
  );
}
