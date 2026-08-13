import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = new WebSocket(import.meta.env.VITE_WS_URL);
        
        newSocket.onopen = () => {
            console.log("WebSocket connected");
            setSocket(newSocket);
        };

        newSocket.onclose = (event) => {
            console.log("WebSocket disconnected");
            setSocket(null);

            if(event.code === 1008) {
                console.log("Unauthorized: Closing socket.");
                navigate('/login');
            }
        };

        return () => {
            newSocket.close();
        };

    }, []);

    return socket;
}