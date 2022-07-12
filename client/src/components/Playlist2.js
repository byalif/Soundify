import "../App.css";
import axios from "axios";
import "../index.css";
import "./playlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import {
  faX,
  faComment,
  faPlay,
  faHeart,
  faBorderNone,
  faColumns,
  faToggleOff,
  faPlus,
  faMusic,
  faHeartMusicCameraBolt,
} from "@fortawesome/free-solid-svg-icons";
import { FaBeer } from "react-icons/fa";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useGlobalContext } from "../context";
import { useParams, useNavigate, Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../images/logo/1.png";
import img2 from "../images/logo/2.png";
import img3 from "../images/logo/3.png";
import img4 from "../images/logo/4.png";

function Playlist() {
  const nav = useNavigate();
  let arr = [img1, img2, img3, img4];
  const [loading, isLoading] = useState(true);
  const btn = useRef();
  const add = useRef();
  const { search } = useParams();
  const sel = useRef();
  const addTo = useRef();
  const [curr, setCurr] = useState(0);
  const [play, setPlay] = useState(false);
  const [grid, setGrid] = useState(true);
  const [column, setColumn] = useState(false);
  const {
    toggle,
    setUsername,
    setLoggedIn,
    setId,
    setToggle,
    theId,
    loggedIn,
  } = useGlobalContext();
  const rotate = [10, 10, 10, 0, 15, 19, 10, 11, 0, 4];
  const colors = [
    "#73bbbf",
    "#9baae0",
    "#b3a6e3",
    "#d197c5",
    "#cc95a3",
    "#95c9b9",
    "#a8c999",
    "#d1ca86",
    "#c2a776",
    "#73c26e",
    "#419154",
  ];

  let idx = 0;
  const [menu, setMenu] = useState(-1);
  const [clicked, setClicked] = useState(true);
  const [playlists, setPlayLists] = useState([]);
  const [theList, setList] = useState("");
  const [thePosts, setPosts] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState("");

  useEffect(() => {
    setList(search);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/playlist/single`,
        { title: search },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((x) => {
        console.log(x.data);
        setPosts(x.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getAllPlayLIsts();
    getUser();
  }, []);

  useEffect(() => {
    isLoading(true);
    setList(search);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/playlist/single`,
        { title: search },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((x) => {
        console.log(x.data);
        setPosts(x.data);
        isLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    getAllPlayLIsts();
    getUser();
  }, [clicked]);

  const getAllPlayLIsts = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/playlist`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((data) => {
        console.log(data);
        setPlayLists(data.data);
        isLoading(false);
      })
      .then((err) => {
        console.log("err");
      });
  };

  const deletePlaylist = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/playlist/deletePlaylist/${theId}/${theList}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((x) => {
        isLoading(true);
        setTimeout(() => {
          console.log(x.data);
          nav(`/playlist/${new Date().getTime()}`);
          getAllPlayLIsts();
          getPlaylist();
          addTo.current.innerText = `Playlist deleted!`;
          addTo.current.style.display = "flex";
          setTimeout(() => {
            addTo.current.style.display = "none";
          }, 1000);
        }, 400);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUser = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((x) => {
        if (x.data.username) {
          console.log(x);
          setId(x.data.id);
          setUsername(x.data.username);
          setLoggedIn(true);
        } else {
          window.location.assign("/login");
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

  const getPlaylist = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/playlist/single`,
        { title: search },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((x) => {
        console.log(x.data);
        setPosts(x.data);
        isLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addPlaylist = () => {
    if (newPlaylist) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/playlist/createPlaylist`,
          { title: newPlaylist, PostId: null },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then((x) => {
          if (x.data.status) {
            if (x.data.status == "CREATED") {
              getPlaylist();
              getAllPlayLIsts();
              setTimeout(() => {
                addTo.current.innerText = `New playlist ${newPlaylist} created`;
                addTo.current.style.display = "flex";
                setTimeout(() => {
                  addTo.current.style.display = "none";
                  nav(`/playlist/${newPlaylist}`);
                }, 1000);
              });
            } else {
              getPlaylist();
              getAllPlayLIsts();
              setTimeout(() => {
                addTo.current.innerText = `Playlist ${newPlaylist} already exists`;
                addTo.current.style.display = "flex";
                setTimeout(() => {
                  addTo.current.style.display = "none";
                  nav(`/playlist/${newPlaylist}`);
                }, 1400);
              });
            }
          }
          console.log("playlist created");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const rmvPlaylist = ({ postId }) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/playlist/add`,
        { title: theList, PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((x) => {
        getPlaylist();
        console.log("playlist created");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkColor = (data) => {
    let ans = false;
    data.forEach((x) => {
      if (x.UserId == theId) {
        ans = true;
      }
    });
    return ans;
  };

  const likePost = (postId) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/likes`,
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((x) => {
        console.log(x.data);
        getPlaylist();
      })
      .catch((x) => {
        console.log("error with likes");
      });
  };

  const addPlay = ({ id }) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/posts/plays`, { id })
      .then((x) => {
        console.log("updated plays");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {loading ? (
        <div
          className={`${toggle ? "loading" : "loading2"}`}
          style={{
            color: `${toggle ? "white" : "black"}`,
            padding: "10px",
            height: "100vh",
            fontSize: "16px",
            fontWeight: "300",
            letterSpacing: "1px",
            backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
          }}
        >
          Loading
        </div>
      ) : (
        <html
          className="whole"
          style={{
            height: "1800vh",
            paddingBottom: "200px",
            backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
          }}
        >
          <div className="list-form">
            <div className="mainselection">
              <label
                style={{ color: `${toggle ? "#ededed" : "black"}` }}
                htmlFor=""
              >
                Playlists:{" "}
              </label>
              {playlists.length == 0 ? (
                <select>
                  <option value="none" selected disabled hidden>
                    No playlists available
                  </option>
                </select>
              ) : (
                <select
                  ref={sel}
                  onChange={(e) => {
                    setList(e.target.value);
                  }}
                >
                  <option selected disabled hidden>
                    Select Playlist
                  </option>
                  {playlists.map((x) => {
                    return (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    );
                  })}
                </select>
              )}
              <button
                ref={btn}
                onClick={() => {
                  setClicked(!clicked);
                  if (theList == "") {
                    sel.current.style.border = "1px solid #730d0d";
                    setTimeout(() => {
                      sel.current.style.border = "none";
                    }, 4000);
                  } else {
                    console.log(theList);
                    nav(`/playlist/${theList}`);
                  }
                }}
              >
                Select
              </button>
            </div>

            <div className="create-list">
              <label
                style={{ color: `${toggle ? "#ededed" : "black"}` }}
                htmlFor=""
              >
                {" "}
                Create playlist
              </label>
              <input
                ref={add}
                onChange={(e) => {
                  setNewPlaylist(e.target.value);
                }}
                value={newPlaylist}
                type="text"
              />
              <button
                onClick={() => {
                  if (newPlaylist == "") {
                    add.current.style.border = "1.5px solid #730d0d";
                    setTimeout(() => {
                      add.current.style.border = "none";
                    }, 5000);
                  } else {
                    addPlaylist();
                  }
                }}
                className="plus"
              >
                ＋
              </button>
              <p
                style={{ color: `${toggle ? "white" : "black"}` }}
                ref={addTo}
                className="top-err"
              >
                Song added to playlist +
              </p>
            </div>
          </div>
          {thePosts.length == 0 ? (
            <div className={`${grid ? "Home-col" : "Home-1col"}`}>
              {" "}
              <span
                style={{
                  color: `${toggle ? "#ededed" : "black"}`,
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "1000px",

                  width: "100vw",
                }}
              >
                {theList != "" ? `Select a playlist or add some tracks.` : ""}
              </span>
            </div>
          ) : (
            <div>
              <div className="top-home">
                <div
                  style={{ color: `${toggle ? "white" : "black"}` }}
                  className="inside"
                >
                  <h4
                    onClick={() => {
                      setGrid(true);
                      setColumn(false);
                    }}
                    className={`${grid ? "shake selected" : ""}`}
                  >
                    {" "}
                    GRID
                  </h4>
                  <h4
                    onClick={() => {
                      setGrid(false);
                      setColumn(true);
                    }}
                    className={`${column ? "shake selected" : ""}`}
                  >
                    {" "}
                    COLUMN
                  </h4>
                </div>
              </div>
              <div
                className="top-menu"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h4
                  style={{ color: `${toggle ? "white" : "black"}` }}
                  className={`${menu == 0 ? "anim" : ""}`}
                  onClick={() => {
                    if (menu == 0) {
                      setMenu(-1);
                    } else {
                      setMenu(0);
                      let newData = thePosts.sort((a, b) => b.plays - a.plays);
                      thePosts(newData);
                    }
                  }}
                >
                  <span
                    style={{
                      borderBottom: `${
                        menu == 0
                          ? `${toggle ? "1px solid white" : "1px solid black"}`
                          : ""
                      }`,
                    }}
                    className={`${toggle ? "lgt" : "drk"} ${
                      menu == 0 ? "menu-selected anim" : ""
                    }`}
                  >
                    MOST PLAYED
                  </span>
                </h4>
                <h4
                  style={{ color: `${toggle ? "white" : "black"}` }}
                  className={`${menu == 1 ? "anim" : ""}`}
                  onClick={() => {
                    if (menu == 1) {
                      setMenu(-1);
                    } else {
                      setMenu(1);
                      let newData = thePosts.sort(
                        (a, b) => b.Likes.length - a.Likes.length
                      );
                      setPosts(newData);
                    }
                  }}
                >
                  <span
                    style={{
                      borderBottom: `${
                        menu == 1
                          ? `${toggle ? "1px solid white" : "1px solid black"}`
                          : ""
                      }`,
                    }}
                    className={`${toggle ? "lgt" : "drk"} ${
                      menu == 1 ? "menu-selected" : ""
                    }`}
                  >
                    MOST LIKED
                  </span>
                </h4>
                <h4
                  style={{ color: `${toggle ? "white" : "black"}` }}
                  className={`${menu == 2 ? "anim" : ""}`}
                  onClick={() => {
                    if (menu == 2) {
                      setMenu(-1);
                    } else {
                      setMenu(2);
                      let newData = thePosts.sort(
                        (a, b) =>
                          new Date().getTime() -
                          new Date(a.createdAt).getTime() -
                          (new Date().getTime() -
                            new Date(b.createdAt).getTime())
                      );
                      thePosts(newData);
                    }
                  }}
                >
                  <span
                    style={{
                      borderBottom: `${
                        menu == 2
                          ? `${toggle ? "1px solid white" : "1px solid black"}`
                          : ""
                      }`,
                    }}
                    className={`${toggle ? "lgt" : "drk"} ${
                      menu == 2 ? "menu-selected" : ""
                    }`}
                  >
                    MOST RECENT
                  </span>
                </h4>
                <h4
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    width: "15px",
                    color: `${toggle ? "white" : "black"}`,
                  }}
                  className={`as ${menu == 2 ? "anim" : ""}`}
                  onClick={() => {
                    deletePlaylist(theList);
                  }}
                >
                  <span
                    style={{
                      borderBottom: "none",
                    }}
                    className={`${toggle ? "lgt" : "drk"} ${
                      menu == 2 ? "menu-selected" : ""
                    }`}
                  >
                    &nbsp;&nbsp;DELETE
                  </span>
                </h4>
              </div>
              <div className={`${grid ? "Home-col" : "Home-1col"}`}>
                {thePosts.map((x, i) => {
                  return (
                    <div>
                      <div
                        style={{
                          backgroundColor: `${colors[x.id % 11]}`,
                        }}
                        className="box-container"
                        key={i}
                      >
                        <div className="top">
                          <div className="txt">
                            {x.title.toUpperCase()}
                            <div className="plus">
                              <FontAwesomeIcon
                                style={{
                                  zIndex: "106",
                                  height: "20px",
                                  padding: "3px",
                                }}
                                onClick={() => {
                                  console.log("hi");
                                  rmvPlaylist({ postId: x.id });
                                }}
                                className="ico"
                                icon={faX}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            nav(`/post/${x.id}`);
                          }}
                          style={{ backgroundImage: `url(${arr[x.id % 4]})` }}
                          className={`gogo bottom ${
                            play && x.id == curr ? "animate" : "animate pause"
                          }`}
                        ></div>

                        <div className="audio-div">
                          <audio
                            onPause={() => {
                              setPlay(false);
                            }}
                            onPlay={() => {
                              addPlay({ id: x.id });
                              setCurr(x.id);
                              setPlay(true);
                            }}
                            className="audio"
                            src={`${x.link}`}
                            type="audio/mp3"
                            controls
                          ></audio>
                        </div>
                      </div>
                      <div
                        style={{ color: `${toggle ? "#d6d6d6" : "black"}` }}
                        className="details gb"
                      >
                        <div>
                          <FontAwesomeIcon
                            className="touch"
                            icon={faPlay}
                          ></FontAwesomeIcon>{" "}
                          {x.plays}
                        </div>
                        <div>
                          <FontAwesomeIcon
                            style={{
                              color: `${
                                checkColor(x.Likes)
                                  ? "#b84f4f"
                                  : `${toggle ? "#d6d6d6" : "black"}`
                              }`,
                            }}
                            onClick={() => {
                              likePost(x.id);
                            }}
                            className="touch"
                            icon={faHeart}
                          ></FontAwesomeIcon>{" "}
                          {x.Likes.length}
                        </div>
                        <div>
                          <FontAwesomeIcon
                            className="touch"
                            icon={faComment}
                          ></FontAwesomeIcon>{" "}
                          {x.Comments.length}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </html>
      )}
    </>
  );
}

export default Playlist;
