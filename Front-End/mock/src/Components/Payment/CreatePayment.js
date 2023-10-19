import React, { useEffect } from "react";
import '../style.css';
import Account from "../Account";
import PaymentInput from "./PaymentInput";

export default function CreatePayment(props){
    document.title="Tạo phiếu chi mới"

    useEffect(()=>{
        localStorage.setItem("open","cash")
        localStorage.setItem("selected","create-payment")
    },[])
    return(
        <div className="content">
            <div className="taskbar">
                <h2>Tạo phiếu chi mới</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <PaymentInput/>
            </div>
        </div>
    );
}
