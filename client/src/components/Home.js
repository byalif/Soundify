import "../App.css";
import axios from "axios";
import "../index.css";
import img1 from "../images/logo/1.png";
import img2 from "../images/logo/2.png";
import img3 from "../images/logo/3.png";
import img4 from "../images/logo/4.png";
import "../loading.css";
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
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Home() {
  const nav = useNavigate();
  const [loading, isLoading] = useState(true);
  const [curr, setCurr] = useState(0);
  const [play, setPlay] = useState(false);
  const [grid, setGrid] = useState(true);
  const [column, setColumn] = useState(false);
  const { getUser, toggle, setToggle, theId } = useGlobalContext();
  const [data, setData] = useState([]);
  const rotate = [2, 8, 6, 0, 12, 1, 8, 11, 0, 4, 9];
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

  let arr = [img1, img2, img3, img4];
  let idx = 0;
  const [menu, setMenu] = useState(-1);
  useEffect(() => {
    fetchPosts();
    getUser();
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

  const fetchPosts = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts`)
      .then((res) => {
        console.log(res.data);
        if (menu == -1) {
          setData(res.data);
          isLoading(false);
        } else {
          if (menu == 0) {
            let newData = res.data.sort((a, b) => b.plays - a.plays);
            setData(newData);
            isLoading(false);
          } else if (menu == 1) {
            let newData = res.data.sort(
              (a, b) => b.Likes.length - a.Likes.length
            );
            setData(newData);
            isLoading(false);
          } else {
            let newData = res.data.sort(
              (a, b) =>
                new Date().getTime() -
                new Date(a.createdAt).getTime() -
                (new Date().getTime() - new Date(b.createdAt).getTime())
            );
            setData(newData);
            isLoading(false);
          }
        }
      })
      .catch((exception) => {
        console.log(exception);
      });
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
        fetchPosts();
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

  const deletePost = (id) => {
    isLoading(true);
    axios
      .delete(`${process.env.REACT_APP_API_URL}/posts/delete/${id}`)
      .then((x) => {
        console.log(id);
        console.log(x);
        isLoading(false);
        fetchPosts();
        console.log("Post deleted!");
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
            paddingBottom: "200px",
            backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
          }}
        >
          <div
            data-text="SOUNDIFY."
            className={`${!toggle ? "top-ttle" : "top-ttle2"}`}
          >
            SOUNDIFY.
          </div>
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
          <div className="top-menu">
            <h4
              style={{ color: `${toggle ? "white" : "black"}` }}
              className={`${menu == 0 ? "anim" : ""}`}
              onClick={() => {
                if (menu == 0) {
                  setMenu(-1);
                } else {
                  setMenu(0);
                  let newData = data.sort((a, b) => b.plays - a.plays);
                  setData(newData);
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
                  let newData = data.sort(
                    (a, b) => b.Likes.length - a.Likes.length
                  );
                  setData(newData);
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
                  let newData = data.sort(
                    (a, b) =>
                      new Date().getTime() -
                      new Date(a.createdAt).getTime() -
                      (new Date().getTime() - new Date(b.createdAt).getTime())
                  );
                  setData(newData);
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
          </div>
          {!Array.isArray(data) ? (
            <div></div>
          ) : (
            <div className={`${grid ? "Home-col" : "Home-1col"}`}>
              {data.map((x, i) => {
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
                            {x.UserId == theId ? (
                              <FontAwesomeIcon
                                onClick={() => {
                                  deletePost(x.id);
                                }}
                                style={{ height: "20px", padding: "3px" }}
                                className="ico"
                                icon={faX}
                              />
                            ) : (
                              <FontAwesomeIcon
                                onClick={() => {
                                  nav(`/add/${x.id}`);
                                }}
                                className="ico"
                                icon={faPlus}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          nav(`/post/${x.id}`);
                        }}
                        className={`gogo bottom ${
                          play && x.id == curr ? "animate" : "animate pause"
                        }`}
                        style={{ backgroundImage: `url(${arr[x.id % 4]})` }}
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
          )}
        </html>
      )}
    </>
  );
}

export default Home;
