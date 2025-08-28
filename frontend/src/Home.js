import logo from './logo.svg';
import './App.css';

import React, {useEffect, useState, useRef} from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import socket from './socket';

function Home() {
  const [status, setStatus] = useState("Connecting...")
  const navigate = useNavigate();
  const [name, setName] = useState('join game');
  useEffect(() => {
    socket.on("connect", () => {
        console.log("waiting for game");
        setStatus("Waiting");
    })


  }, []);

  const toLobby = () => {
    navigate('/lobby');
  }

  return (
    <div className="App">
      <Button onClick={toLobby} sx={{ 
          backgroundColor: 'black', 
          color: 'white',
          '&:hover': {
            backgroundColor: '#333',
          },
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'align-center',
          alignItems: 'center'
        }}>{name}</Button>
    </div>
  );
}

export default Home;
