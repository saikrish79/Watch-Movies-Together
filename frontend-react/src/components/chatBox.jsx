import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import { useUserStore, useRoomStore, useConnectionStore } from "../store/store";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ChatBox(props, ref) {
  const [messages, setMessages] = useState([]);
  const user = useUserStore((state) => state.user);
  const room = useRoomStore((state) => state.room);
  const chatChannelMain = useConnectionStore((state) => state.chatChannel);
  const msgRef = useRef("");
  const scrollRef = useRef(null);
  const userList = useRef([]);
  // const [tempUpdate, setTempUpdate] = useState(true);

  const chatChannel = useRef();
  chatChannel.current = chatChannelMain;
  //console.log(chatChannel.current);

  useEffect(() => {
    msgRef.current.addEventListener("keydown", enterToSendHandler);
    return () => {};
  }, []);

  useEffect(() => {
    //console.log("chatChannel update reflected" + JSON.stringify(chatChannel));
    userList.current = room.usersInRoom;
  }, [chatChannelMain]);

  useImperativeHandle(ref, () => ({
    onChatMessage: (data) => {
      handleChatMessage(data);
    },
    // onChatNeedRender: () => {
    //   setTempUpdate(!tempUpdate);
    // },
  }));

  const handleChatMessage = (data) => {
    setMessages((prevMsgs) => [...prevMsgs, data]);
  };

  const enterToSendHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (msgRef.current.value !== "") handleMessageSend();
    }
  };

  function handleMessageSend() {
    const msg = {
      id: Date.now(),
      fromUser: user.ID,
      fromName: user.name,
      text: msgRef.current.value,
    };
    setMessages((prevMsgs) => [...prevMsgs, msg]);
    //console.log(userList.current);
    userList.current.forEach((_user) => {
      if (chatChannel.current[_user.id].readyState === "open")
        chatChannel.current[_user.id].send(JSON.stringify(msg));
    });
    msgRef.current.value = "";
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <div className="row p-1 pt-4">
        <div
          className="col m-1"
          style={{ height: 600 + "px", overflow: "auto" }}
        >
          {messages.map((m) => (
            <ul
              style={{ paddingLeft: "0", display: "block", width: "100%" }}
              key={m.id}
            >
              <Message message={m} />
              <br></br>
            </ul>
          ))}

          <div ref={scrollRef} />
        </div>
      </div>
      <div className="row mt-4">
        <div className="input-group mb-3">
          <input
            ref={msgRef}
            type="text"
            className="form-control"
            placeholder="Your text..."
            aria-label="Your text..."
            aria-describedby="button-addon2"
          />
          <button
            onClick={handleMessageSend}
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Message(props) {
  const { message } = props;
  const user = useUserStore((state) => state.user);
  const room = useRoomStore((state) => state.room);
  useEffect(() => {}, [room]);
  //let rUser = room.usersInRoom.find((_user) => _user.id === message.fromUser);
  // console.log(rUser);
  //typeof rUser === "undefined"
  let user_id = message.fromUser;
  let user_name = message.fromName;
  let self = user.ID === user_id;
  const calculateStyle = () => {
    if (self) return "float-end font-weight-light text-right";
    else return "float-start font-weight-light";
  };

  const calculateTextAlign = () => {
    if (self) return "right";
    else return "left";
  };

  const calculateIdColor = () => {
    if (self) return "#0d6efd";
    else return "grey";
  };

  return (
    <div
      className={calculateStyle()}
      style={{
        marginBottom: "3px",
        display: "block",
        textAlign: calculateTextAlign(),
        width: "100%",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "12px",
            marginBottom: "0px",
            display: "block",
            color: calculateIdColor(),
          }}
        >
          {(self && user.name) || user_name}
        </p>
      </div>
      <div>
        <p style={{ marginBottom: "0px", display: "block" }}>{message.text}</p>
      </div>
    </div>
  );
}

export default React.forwardRef(ChatBox);
