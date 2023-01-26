import axios from "axios";

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  //api: window.location.origin + "/api",
  //websocketApi: "ws://" + window.location.host + "/socket",
  //api: "http://localhost:8080/api",
  //websocketApi: "ws://localhost:8080/socket",
  api: "https://letzwmt-backend.herokuapp.com/api",
  websocketApi: "wss://letzwmt-backend.herokuapp.com/socket",
};
