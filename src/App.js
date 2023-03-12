import "./assets/css/App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "./utils/API";
import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";
import HomePage from "./components/Home";
import JoinChat from "./components/JoinChat";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import Community from "./components/Community";
import { io } from "socket.io-client";

// Dev URL
const socket = io("http://localhost:3001");
// Production Build
// const socket = io("https://cattention-api.herokuapp.com");

function App() {
  // eslint-disable-next-line
  const [userToken, setUserToken] = useState("");
  const [userObject, setUserObject] = useState({});
  const [roomData, setRoomData] = useState("");
  const [signUpFormData, setSignUpFormData] = useState({
    username: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  const [currentUser, setCurrentUser] = useState("");

  // State for room preferences needs to live here to be accessed in profile and other locations.

  const [roomPreferences, setRoomPreferences] = useState({
    roomName: "",
    breakTime: "",
    workTime: "",
    minigameToggle: false,
  });

  // triggers on page load so userObject is set to the data within token data. This includes user ID, and username.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      API.isValidToken(storedToken).then((tokenData) => {
        if (tokenData) {
          console.log(tokenData.data.user);
          setUserObject(tokenData.data.user);
          setCurrentUser(tokenData.data.user.username);
          console.log(currentUser);
        }
      });
    } else {
      console.log("no token");
    }
  }, [userToken]);

  const handleSignUpFormChange = (e) => {
    e.preventDefault();
    setSignUpFormData({
      ...signUpFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginFormChange = (e) => {
    e.preventDefault();
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  const clearSignupForm = () => {
    setSignUpFormData({
      username: "",
      password: "",
    });
  };

  const clearLoginForm = () => {
    setLoginFormData({
      username: "",
      password: "",
    });
  };

  return (
    <BrowserRouter>
      <Navigation socket={socket} />
      <Routes>
        <Route
          path="/"
          element={<HomePage setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="/signup"
          element={
            <SignUp
              handleSignUpFormChange={handleSignUpFormChange}
              signUpFormData={signUpFormData}
              clearSignupForm={clearSignupForm}
              setUserToken={setUserToken}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              handleLoginFormChange={handleLoginFormChange}
              loginFormData={loginFormData}
              clearLoginForm={clearLoginForm}
              setUserToken={setUserToken}
              currentUser={currentUser}
            />
          }
        />
        <Route
          path="/joinchat"
          element={
            <JoinChat
              socket={socket}
              userToken={userToken}
              roomData={roomData}
              setRoomData={setRoomData}
              setCurrentUser={setCurrentUser}
              setUserObject={setUserObject}
              setUserToken={setUserToken}
              currentUser={currentUser}
              userObject={userObject}
            />
          }
        />
        <Route
          path="/createroom"
          element={
            <CreateRoom
              socket={socket}
              userObject={userObject}
              userToken={userToken}
              roomPreferences={roomPreferences}
              setRoomPreferences={setRoomPreferences}
              roomData={roomData}
              setRoomData={setRoomData}
            />
          }
        />
        <Route
          path="/chat"
          element={
            <Room
              socket={socket}
              roomData={roomData}
              userObject={userObject}
              currentUser={currentUser}
              roomPreferences={roomPreferences}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile userObject={userObject} setUserObject={setUserObject} />
          }
        />
        <Route path="/community" element={<Community />} />
        <Route path="*" element={<h1>404 page not found'</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
