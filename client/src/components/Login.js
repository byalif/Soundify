import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import "./register.css";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const nav = useNavigate();
  const user = useRef(null);
  const success = useRef(null);
  const password = useRef(null);
  const { getUser, toggle, loggedIn, setLoggedIn, setId, theId } =
    useGlobalContext();

  useEffect(() => {
    getUser();
  }, []);
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  const login = (data) => {
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_API_URL}/users/login`, data)
      .then((x) => {
        if (x.data.status == "SUCCESS") {
          user.current.style.display = "none";
          password.current.style.display = "none";
          success.current.style.display = "inline-block";
          success.current.innerText = "Logging in...";
          setLoggedIn(true);
          setId(x.data.id);
          localStorage.setItem("id", x.data.id);
          setTimeout(() => {
            localStorage.setItem("username", x.data.username);
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("accessToken", x.data.accessToken);
            nav("/");
          }, 1500);
        } else if (x.data.status == "NOT_FOUND") {
          user.current.style.display = "inline-block";
          user.current.innerText = "username not found";
        } else if (x.data.status == "WRONG_PASSWORD") {
          password.current.style.display = "inline-block";
          password.current.innerText = "incorrect password";
        }
        setTimeout(() => {
          user.current.style.display = "none";
          password.current.style.display = "none";
        }, 3000);

        console.log(x.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{
        height: "100vh",

        backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
      }}
      className="reg-cont"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={login}
      >
        <div className="formreg-cont">
          <Form className="form-reg">
            <div style={{ color: "white" }} className="ttle">
              LOGIN
            </div>
            <label htmlFor="">Username</label>
            <ErrorMessage
              component="div"
              className={`error ${!toggle ? "no" : ""}`}
              name="username"
              style={{ color: "#cccccc" }}
            />
            <p ref={user} className="user-err"></p>
            <Field
              placeholder="e.g bob.."
              className="input"
              name="username"
              type="text"
            />

            <label htmlFor="">Password</label>
            <ErrorMessage
              component="div"
              className={`error ${!toggle ? "no" : ""}`}
              name="password"
              style={{ color: "#cccccc" }}
            />
            <p ref={password} className="user-err"></p>
            <Field
              placeholder="Enter password.."
              className="input"
              name="password"
              type="password"
            />
            <p ref={success} className="user-err"></p>
            <button type="submit" className="register">
              Login
            </button>
          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default Login;
