import React, { useState } from 'react';
import Login from './Components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from './Components/Main';
import Menubar from './Components/Menubar';
import ProviderList from './Components/ProviderList';
function App(){
  return(
    <div>
      <Menubar
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/main' element={<Main />}/>
          <Route path='/provider-list' element={<ProviderList />}/>
          <Route path='/main' element={<Main />}/>
          <Route path='/main' element={<Main />}/>
          <Route path='/main' element={<Main />}/>
          <Route path='/main' element={<Main />}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App;