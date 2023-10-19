import React, { useEffect } from "react";
import '../style.css';
import Account from "../Account";
import EmployeeInput from "./EmployeeInput";

export default function CreateEmployee(props){
    document.title="Danh sách nhân viên"

    useEffect(()=>{
        localStorage.setItem("open","employee")
        localStorage.setItem("selected","create-employee")
    },[])
    return(
        <div className="content">
            <div className="taskbar">
                <h2>Tạo nhân viên</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <EmployeeInput/>
            </div>
        </div>
    );
}