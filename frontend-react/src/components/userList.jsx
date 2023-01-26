import React from "react";
import { useRoomStore } from "../store/store";

function UserList() {
  const usersInRoom = useRoomStore((state) => state.room.usersInRoom);

  return (
    <>
      <div className="" style={{ minHeight: 120 }}>
        <div className="card card-body" style={{ width: 100 + "vh" }}>
          <h5 className="card-title">Room Members</h5>
          <div className="row row-cols-1 row-cols-md-auto g-4">
            {usersInRoom.length === 0 ? (
              <p>There are no users in the room currently...</p>
            ) : (
              usersInRoom.map((u) => <User key={u.id} user={u}></User>)
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function User(props) {
  let isHost = props.user.userHost;
  const calculateUserStyle = () => {
    return isHost
      ? "card card-body text-bg-success mb-3"
      : "card card-body text-bg-light mb-3";
  };

  return (
    <div className="col">
      <div className={calculateUserStyle()} style={{ maxWidth: 16 + "rem" }}>
        <p className="card-text">{props.user.name}</p>
      </div>
    </div>
  );
}

export default UserList;
