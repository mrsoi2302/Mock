import React, { useEffect } from "react";
import './style.css';
import Dashboard from "./Dashboard";
import Account from "./Account";


export default function Main(props){
    document.title="Trang chủ"
    useEffect(()=>{
      localStorage.removeItem("open")
      localStorage.removeItem("selected")
    },[])
    return(
      <div className="content">
        <div className="taskbar">
          <h2>Tổng quan</h2>
          <Account
            name={localStorage.getItem("name")}
          />
        </div>
        <div className="inside">
          <Dashboard
            type={"customer"}
            title={"Khách hàng"}
          />
          <Dashboard
            type={"provider"}
            title={"Nhà cung cấp"}
          />
          <Dashboard
            type={"receipt"}
            title={"Phiếu thu"}
          />
          <Dashboard
            type={"customer"}
            title={"Phiếu chi"}
          />
        </div>
      </div>
      
    );
        
}