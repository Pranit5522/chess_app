import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    const handlePlay = (event: React.MouseEvent<HTMLElement>, screen: string) => {
        event.preventDefault();
        navigate(screen);
    };
    return <div className="navbar">
        <img src="/chess-logo.png" alt="logo" />
        <div className="menu">
            <p onClick={(event) => handlePlay(event, '/')}>Home</p>
            <p onClick={(event) => handlePlay(event, '/game')}>Play</p>
            <p>Puzzles</p>
        </div>
        <button className="yellow-btn">Login</button>
    </div>
}