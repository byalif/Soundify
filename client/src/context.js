import React, { createContext, useContext, useState, useRef } from "react";
import axios from "axios";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [theId, setId] = useState(0);
  const addTo = useRef();
  const [username, setUsername] = useState("");

  const cool = () => {
    addTo.current.style.display = "inline-block";
    setTimeout(() => {
      addTo.current.style.display = "none";
    }, 4000);
  };

  const getUser = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((x) => {
        if (!x.data.status) {
          setId(x.data.id);
          setUsername(x.data.username);
          console.log("logged in");
          setLoggedIn(true);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("username");
          setUsername("");
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AppContext.Provider
      value={{
        setId,
        theId,
        getUser,
        loggedIn,
        username,
        setLoggedIn,
        cool,
        toggle,
        setToggle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
