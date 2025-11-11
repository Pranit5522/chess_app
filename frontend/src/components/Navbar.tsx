type NavbarProps = {
  handlePlay: (event: React.MouseEvent<HTMLParagraphElement>) => void;
};

export const Navbar = (props: NavbarProps) => {
    return <div className="navbar">
        <img src="/chess-logo.png" alt="logo" />
        <div className="menu">
            <p>Home</p>
            <p onClick={props.handlePlay}>Play</p>
            <p>Puzzles</p>
        </div>
        <button className="login-btn">Login</button>
    </div>
}