import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Setting from "./pages/Setting/Setting";
import Faq from "./pages/Faq";
import Qna from "./pages/Qna";
import Mypage from "./pages/Mypage/Mypage";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";

function App() {
  return (
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
