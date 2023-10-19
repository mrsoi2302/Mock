import React, { useEffect } from "react";
import '../style.css';
import Account from "../Account";
import ProviderInput from "./ProviderInput";

export default function CreateProvider(props){
    document.title="Danh sách nhà cung cấp"

    useEffect(()=>{
        localStorage.setItem("open","provider")
        localStorage.setItem("selected","create-provider")
    },[])
    return(
        <div className="content">
            <div className="taskbar">
                <h2>Tạo nhà cung cấp</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <ProviderInput/>
            </div>
        </div>
    );
}