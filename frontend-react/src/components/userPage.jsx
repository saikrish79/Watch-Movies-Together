import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import http from "../services/httpService";
import { useUserStore } from "../store/store";

export default function UserPage(props) {
  const errorRef = useRef("");
  const inputRef = useRef("");

  const user = useUserStore((state) => state.user);
  const changeUserName = useUserStore((state) => state.changeUserName);

  const navigate = useNavigate();

  const handleChangeUserName = (e) => {
    e.preventDefault();
    if (inputRef.current.value !== "") {
      const userName = inputRef.current.value;
      //console.log(userName);
      let userNameAlreadyPresent = false;

      http
        .get(
          http.api + "/user/validateUserNameChange/" + user.ID + "/" + userName
        )
        .then((response) => {
          changeUserName(userName);
          //console.log(response);
          userNameAlreadyPresent = response.data;
        });

      if (userNameAlreadyPresent) {
        errorRef.current.innerHTML =
          "User name already exists in the room. Please enter a different username";
        setTimeout(() => {
          errorRef.current.innerHTML = "";
        }, 4000);
      } else {
        http
          .post(http.api + "/user/changeUserName/" + user.ID + "/" + userName)
          .then((response) => {
            props.onWebSocketSend({
              event: "changeUserName",
              fromUser: user.ID,
              msg: "",
            });
          });
        navigate(-1);
      }
    }
  };

  return (
    <div
      className="container text-center d-flex align-items-center justify-content-center"
      style={{ minHeight: 700 + "px" }}
    >
      <div className="card form-signin">
        <h1 className="h3 mb-3 fw-normal">Change Display name</h1>
        <p className="mb-3 fw-normal">
          Enter a custom user name of your choice...
        </p>
        <div className="form-floating">
          <input
            type="text"
            name="userName"
            ref={inputRef}
            className="form-control"
          />
          <label htmlFor="userName">Username</label>
        </div>
        <br></br>
        <button
          className="w-100 btn btn-lg btn-primary"
          onClick={handleChangeUserName}
        >
          Change
        </button>
        <p className="col mt-6 p-3 text-danger " ref={errorRef}></p>
      </div>
    </div>
  );
}
