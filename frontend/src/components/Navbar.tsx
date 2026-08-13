import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    const handleRedirection = (event: React.MouseEvent<HTMLElement>, screen: string) => {
        event.preventDefault();
        navigate(screen);
    };
    return <div className="navbar">
        <img src="/chess_logo.png" alt="logo" />
        <div className="menu">
            <p onClick={(event) => handleRedirection(event, '/')}>Home</p>
            <p onClick={(event) => handleRedirection(event, '/game')}>Play</p>
            <p>Puzzles</p>
        </div>
        <button className="yellow-btn" onClick={(event) => handleRedirection(event, '/login')}>Login</button>
    </div>
}