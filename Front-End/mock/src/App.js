import React, { useState } from 'react';
import Login from './Components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from './Components/Main';
import Menubar from './Components/Menubar';
function App(){
  const[open,setOpen]=useState('');
  const[selected,setSelected]=useState('');
  const handleOpen=(e)=>{
    setOpen(e)
  }
  const handleSelected=(e)=>{
    setSelected(e)
  }
  return(
    <div>
      <Menubar
        open={open}
        selected={selected}
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/main' element={<Main setOpen={handleOpen} setSelected={handleSelected}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App;