import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Report from './components/Report';

function App() {
    return (
        <div style={{backgroundColor:'#21242D', height:'100%', width:'100%'}}>
            <Navbar />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/report' element={<Report />} />
                </Routes>
            </BrowserRouter>
            <br />
        </div>
    )
}

export default App