import crown from "../assets/images/crown.png";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MessageType } from "../types/messageTypes";

export const JoinGame = (props: { ws: null | WebSocket }) => {
    const startGame = () => {
        if (props.ws === null) {
            console.log("WebSocket is not connected.");
            return;
        }
        props.ws.send(JSON.stringify({ type: MessageType.INIT_GAME }));
    };

    return (
        <div className="game-menu">
            <img src={crown} alt="crown" />
            <h1>Play Online</h1>
            <button onClick={startGame}>
                <p>Start Game</p>
                <ArrowForwardIosIcon className="icon"/>
            </button>
            <p>Challenge a Human Opponent</p>
        </div>
    );
};