import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../css/App.css";

export default function Footer() {
  return (
    //<footer className="footer mt-auto py-3 bg-light">
    // <div className="container">
    //  <span className="text-muted">Place sticky footer content here.</span>
    // </div>
    // </footer>
    // <footer className="footer mt-auto py-3 bg-light">
    <div className="container text-center text-muted">
      <p className="mb-1 pt-3 text-muted">
        Made with <FontAwesomeIcon icon={faHeart} />
      </p>
      <p className="mt-1 mb-3 text-muted">&copy; Ays, 2022</p>
    </div>
    // </footer>
  );
}
