import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Setting from "./pages/Setting/Setting";
import Mypage from "./pages/Mypage/Mypage";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Store from "./pages/Store/Store";
import { AuthProvider } from "./services/AuthContext";
import FQna from "./pages/Qna/Fix/FQna";
import FQnaDetail from "./pages/Qna/Fix/FQnaDetail";
import FQnaNew from "./pages/Qna/Fix/FQnaNew";
import FQnaEdit from "./pages/Qna/Fix/FQnaEdit";
import Quest from "./pages/Quest/Quest";
import QuestSuccess from "./pages/Quest/QuestSuccess";
import QuestFail from "./pages/Quest/QuestFail";
import QuestSpeed from "./pages/Quest/Speed/QuestSpeed";
import Faq from "./pages/Faq/Faq";
import Acid from "./pages/Quest/Acid/Acid";

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
            <Route path="/store" element={<Store />} />
            <Route path="/qna" element={<FQna />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/qnadetail/:id" element={<FQnaDetail />} />
            <Route path="/qnanew" element={<FQnaNew />} />
            <Route path="/qnaedit/:id" element={<FQnaEdit />} />
            <Route path="/quest" element={<Quest />} />
            <Route path="/questsuccess" element={<QuestSuccess />} />
            <Route path="/questfail" element={<QuestFail />} />
            <Route path="/questspeed" element={<QuestSpeed />} />
            <Route path="/questacid" element={<Acid />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
