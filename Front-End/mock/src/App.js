import React, {  } from 'react';
import Login from './Components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from './Components/Main';
import Menubar from './Components/Menubar';
function App(){
  return(
    <div>
      <Menubar/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/main' element={<Main/>}/>
          <Route path='/mains' element={<Main/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App;