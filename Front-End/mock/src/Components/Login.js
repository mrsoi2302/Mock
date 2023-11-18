import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Config";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [token, setToken] = useState();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
    if (token != null) {
      navigate("/main");
      console.log(token);
    }
  });
  const handleSubmit = () => {
    axios({
      method: "post",
      url: baseURL + "/login",
      data: {
        username: username,
        password: password,
      },
    })
      .then((res) => {
        localStorage.setItem("jwt", res.data);
        localStorage.setItem("username",username)
        navigate("/main");
      })
      .catch((err) => {
        setFailed(true);
        console.error(err);
      });
  };
  const keyDown=(e)=>{
    if(e.key==="Enter") handleSubmit();
  }
  return (
    <div
      className={"container"}
    >
      <div className="login-box">
        <img
          src="https://tuannt-test.mysapogo.com/v2/images/logo_sapo.svg"
          alt=""
          className="logo"
        />
        <Input
          type="text"
          className="input-form"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          type="password"
          className="input-form"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyDown={keyDown}
        />
        {failed && <p className="error"> Sai thông tin đăng nhập</p>}
        <Button type="primary" className="login-button" onClick={handleSubmit}>
          Login
        </Button>
      </div>
    </div>
  );
}
