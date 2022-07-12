import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const Register = () => {
  const nav = useNavigate();
  const user = useRef(null);
  const success = useRef(null);
  const { toggle, getUser } = useGlobalContext();
  const initialValues = {
    username: "",
    password: "",
    password2: "",
  };
  useEffect(() => {
    getUser();
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().max(15).required(),
    password: Yup.string().min(6).required(),
    password2: Yup.string()
      .min(6)
      .required()
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  });

  const register = (data) => {
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_API_URL}/users`, data)
      .then((x) => {
        if (x.data.status == "NOT_UNIQUE") {
          user.current.innerText = "Username already exists";
          user.current.style.display = "inline-block";
        }

        if (x.data.status != "NOT_UNIQUE") {
          user.current.style.display = "none";
          success.current.style.display = "inline-block";
          success.current.innerText = "Acount created. Redirecting..";
          setTimeout(() => {
            nav("/login");
          }, 1500);
        }
        console.log(x.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  return (
    <html
      style={{
        height: "110vh",
        backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
      }}
      className="reg-cont"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={register}
      >
        <div className="formreg-cont">
          <Form className="form-reg">
            <div style={{ color: "white" }} className="ttle">
              REGISTER
            </div>
            <label htmlFor="">Username</label>
            <p
              style={{ fontSize: "small", margin: "0" }}
              ref={user}
              className="user-err"
            >
              Username already exists.
            </p>
            <ErrorMessage
              component="div"
              className={`error ${!toggle ? "no" : ""}`}
              name="username"
              style={{ color: "#cccccc" }}
            />
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
            <Field
              placeholder="min of 6 characters.."
              className="input"
              name="password"
              type="password"
            />
            <label htmlFor="">Passwordx2</label>
            <ErrorMessage
              component="div"
              className={`error ${!toggle ? "no" : ""}`}
              name="password2"
              style={{ color: "#cccccc" }}
            />
            <Field
              placeholder="min of 6 characters.."
              className="input"
              name="password2"
              type="password"
            />
            <p
              style={{ fontSize: "small", margin: "0" }}
              ref={success}
              className="user-err"
            >
              Username already exists.
            </p>
            <button type="submit" className="register">
              Sign up
            </button>
          </Form>
        </div>
      </Formik>
    </html>
  );
};

export default Register;
