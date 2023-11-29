import { useEffect, useState } from "react"

export const Token=()=>{
    return "Bearer "+localStorage.getItem("jwt");
}