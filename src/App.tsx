import "./App.css";
import { useReducer, useRef, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Setting from "./pages/Setting";
import Faq from "./pages/Faq/Faq";
import Mypage from "./pages/Mypage";
import Profile from "./pages/Profile";
import FQna from "./pages/Qna/Fix/FQna";
import FQnaDetail from "./pages/Qna/Fix/FQnaDetail";
import FQnaNew from "./pages/Qna/Fix/FQnaNew";
import FQnaEdit from "./pages/Qna/Fix/FQnaEdit";
import Quest from "./pages/Quest/Quest";
import QuestSuccess from "./pages/Quest/QuestSuccess";
import QuestFail from "./pages/Quest/QuestFail";
import QuestSpeed from "./pages/Quest/QuestSpeed";



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
          <Route path="/qna" element={<FQna />} />
          <Route path="/qnadetail/:id" element={<FQnaDetail />} />
          <Route path="/qnanew" element={<FQnaNew />} />
          <Route path="/qnaedit/:id" element={<FQnaEdit />} />
          <Route path="/quest" element={<Quest/>}/>
          <Route path="/questsuccess" element={<QuestSuccess/>}/>
          <Route path="/questfail" element={<QuestFail/>}/>
          <Route path="/questspeed" element={<QuestSpeed/>}/>

          {/* <Route path="/qna" element={<Qna />} />
          <Route path="/qnadiary/:id" element={<QnaDiary />} />
          <Route path="/qnanew" element={<QnaCreate />} />
          <Route path="/qnalist" element={<QnaList />} />
          <Route path="/qnaedit/:id" element={<QnaEdit />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
