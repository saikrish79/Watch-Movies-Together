import {
  faAddressCard,
  faBell,
  faFaceFrown,
  faFaceSmileWink,
  faFileVideo,
  faMessage,
  faPlusSquare,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightToBracket,
  faArrowsRotate,
  faChalkboardTeacher,
  faFileImport,
  faKey,
  faLink,
  faStarOfLife,
  faTriangleExclamation,
  faUnderline,
  faUsers,
  faUsersBetweenLines,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function HowTo() {
  return (
    <div className="container">
      <h3 className="display-4 pb-4 my-4 border-bottom">How to use LetzWMT</h3>
      <h4 className="display-6 mb-4 ">Rooms</h4>
      <ul className="list-unstyled">
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            icon={faFaceSmileWink}
            fixedWidth
          ></FontAwesomeIcon>
          Rooms can be created or joined if already created by someone
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faBell}
          ></FontAwesomeIcon>
          Notifications and alerts will be displayed on the first column of top
          bar inside a room..
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faLink}
          ></FontAwesomeIcon>
          Room's link can be found on second column of the top bar. One click to
          copy it!
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faUsersBetweenLines}
          ></FontAwesomeIcon>
          Users in the room can be found on the bottom of the page. Host of the
          room will be in green color
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faTriangleExclamation}
          ></FontAwesomeIcon>
          Navigating to any other page inside the applicaiton will exit the room
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faMessage}
          ></FontAwesomeIcon>
          Users can chat between the room members using the chat box
        </li>
      </ul>
      <br></br>
      <br></br>
      <h4 className="display-6 mb-4 ">Create Room</h4>
      <ul className="list-unstyled">
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faPlusSquare}
          ></FontAwesomeIcon>
          Click the <strong>Create room</strong> button from the room tab to
          create a new room
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faChalkboardTeacher}
          ></FontAwesomeIcon>
          You will be the host of the room
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faUserTag}
          ></FontAwesomeIcon>
          If you exit, any other user will be made host
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faKey}
          ></FontAwesomeIcon>
          You will have the option to toggle <strong>Host mode</strong> which
          will disable controls for other users of the room
        </li>
      </ul>
      <br></br>
      <br></br>
      <h4 className="display-6 mb-4 ">Join Room</h4>
      <ul className="list-unstyled">
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faArrowRightToBracket}
          ></FontAwesomeIcon>
          Click the <strong>Join room</strong> button from the room tab to join
          an existing room
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faUsers}
          ></FontAwesomeIcon>
          You will be one of the members of the room
        </li>
      </ul>
      <br></br>
      <br></br>
      <h4 className="display-6 mb-4 ">Media Playback</h4>
      <ul className="list-unstyled">
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faStarOfLife}
          ></FontAwesomeIcon>
          Host has to select the file first.
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faFileVideo}
          ></FontAwesomeIcon>
          Once host selects, other will have to option to select the file
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faFileImport}
          ></FontAwesomeIcon>
          All the users have to select the same file
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faArrowsRotate}
          ></FontAwesomeIcon>
          Once selected all the actions and playback will be in sync between the
          users the room.
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faSquare}
          ></FontAwesomeIcon>
          A border around the player controls can be found.<br></br>
          <div style={{ paddingLeft: 1 + "rem" }}>
            <FontAwesomeIcon
              style={{ margin: "auto " + 1 + "rem" }}
              fixedWidth
              icon={faSquare}
              color={"green"}
            ></FontAwesomeIcon>
            Green - Player is in sync with other host.<br></br>
          </div>
          <div style={{ paddingLeft: 1 + "rem" }}>
            <FontAwesomeIcon
              style={{ margin: "auto " + 1 + "rem" }}
              fixedWidth
              icon={faSquare}
              color={"red"}
            ></FontAwesomeIcon>
            Red - Player is not in sync. Please rejoin or check with host for
            any network issues.
          </div>
        </li>
      </ul>
      <br></br>
      <br></br>
      <h4 className="display-6 mb-4 ">User Customization</h4>
      <ul className="list-unstyled">
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faAddressCard}
          ></FontAwesomeIcon>
          Users can change a name of their own before entering the room.
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faUnderline}
          ></FontAwesomeIcon>
          Just click on the Temporary ID on the top right of the page from Home
          or Howto page
        </li>
        <li className="mb-2">
          <FontAwesomeIcon
            style={{ margin: "auto " + 1 + "rem" }}
            fixedWidth
            icon={faFaceFrown}
          ></FontAwesomeIcon>
          If a user with same name exists in the room, it will automatically be
          updated. You can exit and change again.
        </li>
      </ul>
      <br></br>
      <br></br>
    </div>
  );
}
