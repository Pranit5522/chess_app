import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./views/Home";
import { Game } from "./views/Game";
import { Login } from "./views/Login";
import { Register } from "./views/Register";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
