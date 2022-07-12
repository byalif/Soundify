import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import "./post.css";

const Post = () => {
  const { toggle, setId, setUsername, setLoggedIn, theId } = useGlobalContext();
  const [audio, setAudio] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    getUser();
  }, []);

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

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(18).required(),
    postText: Yup.string().min(3).max(30).required(),
  });

  const readURL = (input) => {
    let audio = input.target.files[0];
    setAudio(audio);
    console.log(audio);
  };

  const uploadSong = (data) => {
    setLoading(true);
    const audioData = new FormData();
    audioData.append("name", data.postText);
    audioData.append("audio", audio);
    if (audio) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/posts/upload`, audioData)
        .then((res) => {
          console.log(res.data);
          let post = {
            UserId: localStorage.getItem("id"),
            username: localStorage.getItem("username"),
            postText: data.postText,
            link: `${res.data.Location}`,
            title: data.title,
            plays: 0,
          };
          axios
            .post(`${process.env.REACT_APP_API_URL}/posts`, post, {
              headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((x) => {
              nav("/");
              setLoading(false);
              console.log("posted succesfully");
            })
            .catch((err) => {
              console.log("whoops");
            });
        })
        .catch((err) => {
          console.log("errrrr");
        });
    } else {
      console.log("audio is empty");
    }
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
          Uploading
        </div>
      ) : (
        <html
          style={{
            paddingTop: "20px",
            height: "100vh",
            backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={uploadSong}
            className="upload-cont"
          >
            <Form
              style={{
                backgroundColor: `${toggle ? "#202633" : "transparent"}`,
              }}
              className={`upload-box ${!toggle ? "light" : "dark"}`}
            >
              <div
                style={{
                  backgroundColor: `${toggle ? "#333b45" : "transparent"}`,
                  color: `${!toggle ? "black" : "white"}`,
                }}
                className="title"
              >
                CHOOSE TRACK
              </div>
              <div className="inside-upload">
                <label
                  style={{ color: `${!toggle ? "black" : "white"}` }}
                  htmlFor=""
                >
                  TITLE
                </label>
                <ErrorMessage
                  component="div"
                  className={`error ${!toggle ? "no" : ""}`}
                  name="title"
                ></ErrorMessage>
                <Field
                  placeholder="Title your track.."
                  name="title"
                  type="text"
                />
                <label
                  style={{ color: `${!toggle ? "black" : "white"}` }}
                  htmlFor=""
                >
                  DESCRIPTION
                </label>
                <ErrorMessage
                  component="div"
                  className="error"
                  name="postText"
                ></ErrorMessage>
                <Field
                  placeholder="Up to 30 characters.."
                  name="postText"
                  type="text"
                />

                <input
                  style={{ color: `${!toggle ? "black" : "white"}` }}
                  onChange={(e) => readURL(e)}
                  type="file"
                  accept="audio/*"
                  placeholder=""
                  class="profile-aud"
                />
              </div>
              <button
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  color: `${!toggle ? "black" : "white"}`,
                  backgroundColor: `${toggle ? "#333b45" : "transparent"}`,
                }}
                type="submit"
              >
                UPLOAD
              </button>
            </Form>
          </Formik>
        </html>
      )}
    </>
  );
};

export default Post;
