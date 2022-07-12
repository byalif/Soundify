import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { AppProvider, useGlobalContext } from "./context";
import Navbar from "./components/Navbar";
import Post from "./components/Post";
import Singlepost from "./components/Singlepost";
import Register from "./components/Register";
import Login from "./components/Login";
import Playlist from "./components/Playlist";
import Playlist2 from "./components/Playlist2";
import Add from "./components/Add.js";
import Notfound from "./components/Notfound";
import "./App.css";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/post/:id" element={<Singlepost />} />
          <Route exact path="/post" element={<Post />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/playlist" element={<Playlist />} />
          <Route exact path="/playlist/:search" element={<Playlist2 />} />
          <Route exact path="/add/:id" element={<Add />} />
          <Route exact path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
