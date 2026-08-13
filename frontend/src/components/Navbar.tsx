import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const isLoggedIn = () => document.cookie.split('; ').some(c => c === 'loggedIn=1');

export const Navbar = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    useEffect(() => {
        setLoggedIn(isLoggedIn());
    }, []);

    const handleRedirection = (event: React.MouseEvent<HTMLElement>, screen: string) => {
        event.preventDefault();
        navigate(screen);
    };

    const handleLogout = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        setLoggedIn(false);
        navigate('/');
    };

    return <div className="navbar">
        <img src="/chess_logo.png" alt="logo" />
        <div className="menu">
            <p onClick={(event) => handleRedirection(event, '/')}>Home</p>
            <p onClick={(event) => handleRedirection(event, '/game')}>Play</p>
            <p>Puzzles</p>
        </div>
        {loggedIn ? (
            <button className="yellow-btn" onClick={handleLogout}>Logout</button>
        ) : (
            <button className="yellow-btn" onClick={(event) => handleRedirection(event, '/login')}>Login</button>
        )}
    </div>
}
