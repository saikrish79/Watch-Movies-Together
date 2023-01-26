import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const navigateToRoomPage = () => {
    navigate("/room");
  };

  return (
    <div className="d-flex text-center text-dark" style={{ marginTop: "7%" }}>
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <main className="px-3">
          <h1>Letz Watch movies together</h1>
          <p className="lead">
            A realtime peer to peer application to watch videos together and
            Chat with your friends and family.
          </p>
          <p className="lead">
            <span
              onClick={navigateToRoomPage}
              className="btn btn-lg btn-warning fw-bold border-grey"
            >
              Explore...
            </span>
          </p>
        </main>
      </div>
    </div>
  );
}
