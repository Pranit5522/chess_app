import { useState, useEffect } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const newSocket = new WebSocket(import.meta.env.VITE_WS_URL);
        
        newSocket.onopen = () => {
            console.log("WebSocket connected");
            setSocket(newSocket);
        };

        newSocket.onclose = () => {
            console.log("WebSocket disconnected");
            setSocket(null);
        };

        return () => {
            newSocket.close();
        };

    }, []);

    return socket;
}