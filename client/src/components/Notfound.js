import React, { useEffect } from "react";
import { useGlobalContext } from "../context";
import "./error.css";

const Notfound = () => {
  const { toggle, getUser } = useGlobalContext();
  useEffect(() => {
    getUser();
  }, []);
  return (
    <html
      style={{
        height: "100vh",
        paddingBottom: "200px",
        backgroundColor: `${!toggle ? "#edebeb" : "#171924"}`,
      }}
    >
      <div id="main err">
        <div className="fof">
          <h1>Error 404</h1>
        </div>
      </div>
    </html>
  );
};

export default Notfound;
