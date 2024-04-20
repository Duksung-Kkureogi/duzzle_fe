import "./App.css";
import { useReducer, useRef, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Setting from "./pages/Setting";
import Faq from "./pages/Faq/Faq";
import Qna from "./pages/Qna/Qna";
import Mypage from "./pages/Mypage";
import Profile from "./pages/Profile";
import QnaCreate from "./pages/Qna/QnaCreate";
import QnaList from "./pages/Qna/QnaList";
import QnaDiary from "./pages/Qna/QnaDiary";
import QnaEdit from "./pages/Qna/QnaEdit";


const mockData = [
  {
    id:1,
    sortType: "계정",
    emailType: "dukdol",
    emailType2: "duksung.com",
    content: "계정 닉네임 몇회까지 수정가능한가요?",
    submitTime: new Date().getTime(),
  },
  {
    id:2,
    sortType: "거래",
    emailType: "duzzle",
    emailType2: "google.com",
    content: "거래 오류 문의 드립니다.",
    submitTime: new Date().getTime(),
  },
];

function reducer(state = mockData, action){
  switch(action.type){
    case 'CREATE': 
      return [action.data, ...state];
    case 'UPDATE': 
      return state.map((item)=>String(item.id) === String(action.data.id)
      ? action.data 
      : item 
    );
    case 'DELETE':
      return state.filter((item)=> String(item.id) != String(action.id));
    default:
      return state;
  }
}


export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();


function App() {

  const [data, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(3)

  const onCreate = (submitTime, sortType, emailType, emailType2,content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        submitTime: new Date().getTime(),
        sortType,
        emailType,
        emailType2,
        content,
      },
    });
  };
  const onUpdate = (id, submitTime, sortType, emailType, emailType2,content)=>{
    dispatch(
      {
        type: "UPDATE",
        data: {
          id, submitTime, sortType, emailType, emailType2, content
        }
      }
    )
  }
  const onDelete = (id)=>{
    dispatch({
      type: "DELETE",
      id,
    });
  };

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{
          onCreate, onUpdate, onDelete,
        }}>
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
                <Route path="/qnadiary/:id" element={<QnaDiary />} />
                <Route path="/qnanew" element={<QnaCreate />} />
                <Route path="/qnalist" element={<QnaList />} />
                <Route path="/qnaedit/:id" element={<QnaEdit/>}/>
              </Routes>
            </div>
          </BrowserRouter>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
