import { useEffect, useState } from "react";

export const timbangan2 = () => {
  const [data, setData] = useState('0');

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/");

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('====================================');
      console.log(event.data);
      console.log('====================================');
      setData(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket connection
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures useEffect runs once on component mount
  
  return data;
};
