import React, { useEffect } from "react";
import '../../style.css';
import Account from "../../Account";
import CustomerInput from "../CustomerInput";
import CustomerTypeInput from "./CustomerTypeInput";

export default function CreateCustomerType(props){
    document.title="Tạo khách hàng mới"

    useEffect(()=>{
        localStorage.setItem("open","customer")
        localStorage.setItem("selected","create-customer")
    },[])
    return(
        <div className="content">
            <div className="taskbar">
                <h2>Tạo khách hàng mới</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <CustomerTypeInput/>
            </div>
        </div>
    );
}