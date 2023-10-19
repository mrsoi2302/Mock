import React, { useEffect } from "react";
import '../style.css';
import Account from "../Account";
import PaymentInput from "./ReceiptInput";
import ReceiptInput from "./ReceiptInput";

export default function CreateReceipt(props){
    document.title="Tạo phiếu thu mới"

    useEffect(()=>{
        localStorage.setItem("open","cash")
        localStorage.setItem("selected","create-receipt")
    },[])
    return(
        <div className="content">
            <div className="taskbar">
                <h2>Tạo phiếu thu mới</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <ReceiptInput/>
            </div>
        </div>
    );
}
