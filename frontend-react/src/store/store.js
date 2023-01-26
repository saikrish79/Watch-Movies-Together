import create from "zustand";

import { devtools, persist } from "zustand/middleware";

const userStore = (set) => ({
  user: {
    ID: "",
    name: "",
    isAuthenticated: false,
    isUserRoomHost: false,
  },
  createUser: (newUser) => {
    set((state) => (state.user = newUser));
  },
  changeUserName: (newUserName) => {
    set((state) => ({
      user: {
        ...state.user,
        name: newUserName,
      },
    }));
  },
  setUserHost: (value) => {
    set((state) => ({
      user: {
        ...state.user,
        isUserRoomHost: value,
      },
    }));
  },
});

export const useUserStore = create(
  devtools(
    persist(userStore, {
      name: "user",
      getStorage: () => sessionStorage,
    })
  )
);

const roomStore = (set, get) => ({
  room: {
    link: "",
    isRoomCreated: false,
    usersInRoom: [],
    isUserRoomHost: false,
  },
  setUserHost: () => {
    set((state) => ({
      room: {
        ...state.room,
        isUserRoomHost: true,
      },
    }));
  },
  createRoom: (newRoom) => {
    set((state) => (state.room = newRoom));
  },
  addUsers: (users) => {
    set((state) => ({
      room: {
        ...state.room,
        usersInRoom: [...state.room.usersInRoom, users],
      },
    }));
  },
  updateUserInRoom: (user) => {
    set((state) => ({
      room: {
        ...state.room,
        usersInRoom: [
          ...state.room.usersInRoom.filter((i) => i.id !== user.Id),
          user,
        ],
      },
    }));
  },
  updateAllUsersInRoom: (users) => {
    set((state) => ({
      room: {
        ...state.room,
        usersInRoom: users,
      },
    }));
  },
  deleteUserInRoom: (user_ID) => {
    set((state) => ({
      room: {
        ...state.room,
        usersInRoom: [
          ...state.room.usersInRoom.filter((i) => i.id !== user_ID),
        ],
      },
    }));
  },
  resetRoom: () => {
    set({
      room: {
        link: "",
        isRoomCreated: false,
        usersInRoom: [],
        isUserRoomHost: false,
      },
    });
  },
});

export const useRoomStore = create(
  devtools(
    persist(roomStore, {
      name: "room",
      getStorage: () => sessionStorage,
    })
  )
);

const connectionStore = (set, get) => ({
  peerConnection: {},
  chatChannel: {},
  playerChannel: {},
  addPeer: (p) => {
    set((state) => ({
      peerConnection: { p },
    }));
  },
  addConnections: (_peerConnection, chatChannel, playerChannel) => {
    //console.log(_peerConnection);
    set((state) => ({
      peerConnection: { ...state.peerConnection, ..._peerConnection },
      chatChannel: { ...state.chatChannel, ...chatChannel },
      playerChannel: { ...state.playerChannel, ...playerChannel },
    }));
    //console.log(get().peerConnection);
  },
  updateConnections: (peerConnection, chatChannel, playerChannel) => {
    set((state) => ({
      peerConnection: { ...peerConnection },
      chatChannel: { ...chatChannel },
      playerChannel: { ...playerChannel },
    }));
  },
  refreshConnections: () => {
    set((state) => ({
      peerConnection: state.peerConnection,
      chatChannel: state.chatChannel,
      playerChannel: state.playerChannel,
    }));
  },
  resetConnections: () => {
    set({
      peerConnection: {},
      chatChannel: {},
      playerChannel: {},
    });
  },
});

export const useConnectionStore = create(
  devtools(
    persist(connectionStore, {
      name: "connection",
      getStorage: () => sessionStorage,
    })
  )
);
