import { Navbar } from "../components/Navbar";
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handlePlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate('/game');
  };

  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <div className="hero-inner">
          <h1>MASTER YOUR MOVES</h1>
          <h2>Play, learn and connect with others</h2>
          <button className="cta" onClick={handlePlay}>PLAY NOW</button>
        </div>
      </div>
    </div>
  );
};
