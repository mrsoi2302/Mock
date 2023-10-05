import React, { useEffect, useState } from "react";
import axios from 'axios';
import './style.css';
import{Button, Input} from 'antd';
import { useNavigate } from "react-router-dom";
export default function Login(){
    const navigate=useNavigate();
    const [username,setUsername]=useState();
    const [password,setPassword]=useState();
    const [token,setToken]=useState();
    const [failed,setFailed]=useState(false);
    useEffect(()=>{
        setToken(localStorage.getItem("jwt"))
        if(token!=null) {
            navigate("/main")
            console.log(token);
        }
    })
    const handleSubmit=()=>{
        axios(
            {
                method:'post',
                url:'http://localhost:8080/login',
                data:{
                    "username":username,
                    "password":password
                }
            }
        ).then(res=>{
            setToken(res.data.data.token);
            localStorage.setItem("jwt",res.data.data.token);
            console.clear()
            navigate("/main");  
            })
        .catch(err=>{
            setFailed(true)
            console.error(err);
        })
    }
    
    
    return(
        <div className={"container"}
        style={{
            paddingTop:"15vh"
        }}>
            <div className="login-box">
                <img src="https://tuannt-test.mysapogo.com/v2/images/logo_sapo.svg" 
                        alt=""
                        className="logo"
                        />
                <Input type="text" className="input-form" placeholder="Username" onChange={e=>{setUsername(e.target.value)}}/>
                <Input type="password" className="input-form" placeholder="Password" onChange={e=>{setPassword(e.target.value)}}/>
                {failed && <p className="error"> Sai thông tin đăng nhập</p>}
                <Button type="primary" className="login-button" onClick={handleSubmit}>Login</Button>
            </div>

        </div>
        
    );
        
}