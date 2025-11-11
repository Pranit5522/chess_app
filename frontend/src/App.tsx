import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./views/Home";
import { Game } from "./views/Game";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
