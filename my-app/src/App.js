import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Upload from "./Upload";

function App() {

    const userId = localStorage.getItem("userId");

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        userId
                            ? <Navigate to="/upload" />
                            : <Login />
                    }
                />

                <Route
                    path="/upload"
                    element={
                        userId
                            ? <Upload />
                            : <Navigate to="/" />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;