import "../App.css";
import axios from "axios";
import "../index.css";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import "./playlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { useGlobalContext } from "../context";
import { useNavigate, useParams } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import img1 from "../images/logo/1.png";
import img2 from "../images/logo/2.png";
import img3 from "../images/logo/3.png";
import img4 from "../images/logo/4.png";

function Add() {
  const nav = useNavigate();
  const [loadingList, isLoadingList] = useState(true);
  const [loadingPost, isLoadingPost] = useState(true);
  const { id } = useParams();
  const input = useRef(null);
  const [play, setPlay] = useState(false);
  const { toggle, setId, setLoggedIn, setUsername, theId } = useGlobalContext();
  const [data, setData] = useState([]);
  const [likes, setLikes] = useState([]);
  const btn = useRef();
  const addTo = useRef();
  const rotate = [2, 8, 6, 0, 12, 1, 8, 11, 0, 4, 9];
  let arr = [img1, img2, img3, img4];
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

  const [playlists, setPlayLists] = useState([]);
  const [theList, setList] = useState("");
  const [thePosts, setPosts] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState("");
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    getUser();
  });

  const getUser = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((x) => {
        if (!x.data.status) {
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
        { title: theList },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((x) => {
        console.log(x.data);
        setPosts(x.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (theList != "") {
      btn.current.innerText = "Add to PlayList";
      btn.current.style.border = "0";
    }
  }, [theList]);

  const addPlaylist = () => {
    if (newPlaylist) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/playlist/createPlaylist`,
          { title: newPlaylist },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then((x) => {
          if (x.data.status) {
            if (x.data.status == "CREATED") {
              getPlaylist();
              allPlaylists();
              setList("");
              setTimeout(() => {
                addTo.current.innerText = `New playlist ${newPlaylist} created`;
                addTo.current.style.display = "flex";
                setTimeout(() => {
                  addTo.current.style.display = "none";
                }, 1000);
              });
            } else {
              getPlaylist();
              allPlaylists();
              setTimeout(() => {
                addTo.current.innerText = `Playlist ${newPlaylist} already exists`;
                addTo.current.style.display = "flex";
                setTimeout(() => {
                  addTo.current.style.display = "none";
                }, 1400);
              });
            }
          }
          console.log("playlist created");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      input.current.style.border = ".5px solid #730d0d";
    }
  };

  const addToPlaylist = () => {
    if (theList) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/playlist/addOnly`,
          { title: theList, PostId: id },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then((x) => {
          if (x.data.status) {
            setTimeout(() => {
              addTo.current.innerText = "Song already in this playlist!";
              addTo.current.style.display = "flex";
              setTimeout(() => {
                addTo.current.style.display = "none";
                nav(`/playlist/${theList}`);
              }, 1300);
            });
          } else {
            console.log("song added to playlist!");
            setTimeout(() => {
              addTo.current.innerText = "Song added to playlist +";
              addTo.current.style.display = "flex";
              setTimeout(() => {
                addTo.current.style.display = "none";
                nav(`/playlist/${theList}`);
              }, 1300);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setLikes(res.data.Likes);
        axios
          .get(`${process.env.REACT_APP_API_URL}/comments/${id}`)
          .then((x) => {
            setAllComments(x.data.reverse());
            isLoadingPost(false);
            console.log(x.data);
          })
          .catch((x) => {
            console.log("err");
          });
      })
      .catch((exception) => {
        console.log(exception);
      });
  };

  const allPlaylists = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/playlist`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((data) => {
        console.log(data);
        setPlayLists(data.data);
        isLoadingList(false);
      })
      .then((err) => {
        console.log("err");
      });
  };

  useEffect(() => {
    fetchData();
    allPlaylists();
  }, []);

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
        fetchData();
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
      {loadingList || loadingPost ? (
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
                <>
                  <select
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
                </>
              )}
              <button
                ref={btn}
                onClick={() => {
                  console.log(theList);
                  if (btn.current.innerText == "Select") {
                    btn.current.style.border = "1.5px solid #730d0d";
                    getPlaylist(theList);
                  } else {
                    addToPlaylist();
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
                ref={input}
                onChange={(e) => {
                  setNewPlaylist(e.target.value);
                }}
                value={newPlaylist}
                type="text"
              />
              <button
                onClick={() => {
                  addPlaylist();
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
          <div
            style={{ backgroundColor: `${!toggle ? "#edebeb" : "#171924"}` }}
          >
            <div
              style={{ color: `${!toggle ? "black" : "white"}` }}
              className="single-ttle"
            >
              {data.title == undefined ? data.title : data.title.toUpperCase()}
              {/* <b>{signs[id % 7]}</b> */}
            </div>
            <div className="singlePost hg">
              <div
                style={{
                  backgroundColor: `${colors[data.id % 11]}`,
                }}
                className="box-container"
              >
                <div className="top">
                  <div className="txt">
                    {data.title} by <b>{data.username}</b>
                    <div className="plus">
                      <FontAwesomeIcon className="ico" icon={faPlus} />
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    nav(`/post/${id}`);
                  }}
                  style={{ backgroundImage: `url(${arr[data.id % 4]})` }}
                  className={`gogo bottom ${
                    play ? "animate" : "animate pause"
                  }`}
                ></div>

                <div className="audio-div">
                  <audio
                    onPause={() => {
                      setPlay(!play);
                    }}
                    onPlay={() => {
                      setPlay(!play);
                      addPlay({ id: data.id });
                    }}
                    className="audio"
                    src={`${data.link}`}
                    type="audio/mp3"
                    controls
                  ></audio>
                </div>
              </div>
              <div
                style={{ color: `${toggle ? "#d6d6d6" : "black"}` }}
                className="details gb"
              >
                <div className="i">
                  <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon> {data.plays}
                </div>
                <div className="i">
                  <FontAwesomeIcon
                    onClick={() => {
                      likePost(data.id);
                    }}
                    style={{
                      color: `${
                        checkColor(likes)
                          ? "#b84f4f"
                          : `${toggle ? "#d6d6d6" : "black"}`
                      }`,
                    }}
                    icon={faHeart}
                  ></FontAwesomeIcon>{" "}
                  {likes.length}
                </div>

                <div className="i">
                  <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>{" "}
                  {allComments.length}
                </div>
              </div>
            </div>
          </div>
        </html>
      )}
    </>
  );
}

export default Add;
