import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Setting from "./pages/Setting/Setting";
import Faq from "./pages/Faq";
import Qna from "./pages/Qna";
import Mypage from "./pages/Mypage/Mypage";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Store from "./pages/Store/Store";
import { AuthProvider } from "./services/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/qna" element={<Qna />} />
            <Route path="/store" element={<Store />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
