import { Routes , Route , Navigate } from "react-router-dom";
import Todo from "./pages/TODO/todo.jsx";
import Login from "./pages/Login/login.jsx";

function App(){
    return(
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/todo" element={<Todo/>} />
            <Route path="*" element={<Login />} />
        </Routes>
    );
}

export default App;