import axios from "axios";
import "../index.css";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faComment,
  faPlay,
  faHeart,
  faBorderNone,
  faX,
  faColumns,
  faToggleOff,
  faPlus,
  faMusic,
  faHeartMusicCameraBolt,
} from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../context";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import img1 from "../images/logo/1.png";
import img2 from "../images/logo/2.png";
import img3 from "../images/logo/3.png";
import img4 from "../images/logo/4.png";

const Singlepost = () => {
  const getTme = (time) => {
    let hour = Math.round(time * 24);
    let minutes = Math.floor(time * 24 * 60);
    if (minutes > 1 && minutes < 60) return `${minutes}m`;
    else if (minutes < 1) return `${minutes}m`;
    else if (minutes == 1) return `${minutes}m`;
    else if (hour >= 24) return `${Math.ceil(time)}d`;
    return `${hour}h`;
  };
  let arr = [img1, img2, img3, img4];
  const curr = new Date();
  const nav = useNavigate();
  const [comment, setComment] = useState("");
  const [loading, isLoading] = useState(true);
  const [allComments, setAllComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [play, setPlay] = useState(false);
  const { setToggle, toggle, getUser, theId, setId, setLoggedIn } =
    useGlobalContext();
  const { id } = useParams();
  const [data, setData] = useState({});
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
  const signs = ["♪", "♩", "♫", "♬", "♮", "♯", "≠"];
  useEffect(() => {
    getUser();
  }, []);

  const deletePost = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/posts/delete/${id}`)
      .then((x) => {
        console.log(id);
        console.log(x);
        nav("/");
        isLoading(false);
        console.log("Post deleted!");
      })
      .catch((err) => {
        console.log(err);
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
            isLoading(false);
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

  const checkColor = (data) => {
    let ans = false;
    data.forEach((x) => {
      if (x.UserId == theId) {
        ans = true;
      }
    });
    return ans;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postComment = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/comments`,
        { comment, PostId: data.id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((x) => {
        fetchData();
        console.log(x.data);
        if (x.data.status == "NOT_AUTHORIZED") {
          nav("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likeComment = (CommentId) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/commentLike`,
        { CommentId: CommentId },
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

  const deleteCom = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/comments/delete/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((x) => {
        console.log("sucessfully deleted");
        fetchData();
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
        <div style={{ backgroundColor: `${!toggle ? "#edebeb" : "#171924"}` }}>
          <div
            style={{ color: `${!toggle ? "black" : "white"}` }}
            className="single-ttle"
          >
            {data.title == undefined ? data.title : data.title.toUpperCase()}
            <b>{signs[id % 7]}</b>
          </div>
          <div className="singlePost">
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
                    {data.UserId == theId ? (
                      <FontAwesomeIcon
                        onClick={() => {
                          isLoading(true);
                          deletePost(data.id);
                        }}
                        style={{ height: "20px", padding: "3px" }}
                        className="ico"
                        icon={faX}
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => {
                          nav(`/add/${data.id}`);
                        }}
                        className="ico"
                        icon={faPlus}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{ backgroundImage: `url(${arr[data.id % 4]})` }}
                className={`gogo bottom ${play ? "animate" : "animate pause"}`}
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
              style={{
                color: `${toggle ? "#d6d6d6" : "black"}`,
              }}
              className="details"
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
            <div className="comment">
              <div className="top2">
                <h4 style={{ letterSpacing: "1px", fontWeight: "100" }}>
                  COMMENTS
                </h4>
              </div>
              <div className="com-cont">
                <div className="t">
                  <div>
                    <span>{data.username}</span> <span>{data.postText}</span>
                  </div>
                  <div>
                    <span>
                      {getTme(
                        (new Date().getTime() -
                          new Date(data.createdAt).getTime()) /
                          (1000 * 3600 * 24)
                      )}
                    </span>
                  </div>
                </div>
                <div className="desc">
                  {allComments.length == 0 ? (
                    <span style={{ padding: "8px" }}>no comments yet</span>
                  ) : (
                    ""
                  )}
                  {allComments.map((x, i) => {
                    return (
                      <div key={i} className="comment-line">
                        <div>
                          <span style={{ color: "#607880" }}>
                            @{x.username}
                          </span>{" "}
                          <span className="the-com">{x.comment}</span>
                        </div>
                        <div className="single-line">
                          <div className="date">
                            {getTme(
                              (new Date().getTime() -
                                new Date(x.createdAt).getTime()) /
                                (1000 * 3600 * 24)
                            )}
                            <span className="likes">
                              {`${x.CommentLikes.length} ${
                                x.CommentLikes.length == 1 ? "like" : "likes"
                              }`}
                            </span>
                          </div>
                          <div>
                            {x.UserId == theId ? (
                              <FontAwesomeIcon
                                onClick={() => {
                                  deleteCom(x.id);
                                }}
                                className="faright"
                                icon={faTrash}
                              ></FontAwesomeIcon>
                            ) : (
                              <FontAwesomeIcon
                                style={{
                                  color: `${
                                    checkColor(x.CommentLikes)
                                      ? "#b84f4f"
                                      : `black`
                                  }`,
                                }}
                                onClick={() => {
                                  likeComment(x.id);
                                }}
                                className="faright"
                                icon={faHeart}
                              ></FontAwesomeIcon>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (comment) {
                    postComment();
                    setComment("");
                  }
                }}
                className="btn-com"
              >
                Send
              </button>
              <input
                placeholder="Type a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="com"
                type="text"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Singlepost;
