import "./QnaCreateEditor.css";
import { useState, useEffect } from "react";
import Button from "./Button";

const QnaCreateEdior = ({initData, onSubmit}) =>{
    const [sortType, setSortType] = useState("거래");
    const [emailType2, setEmailType] = useState("naver.com");

    const onChangeSortType = (e) => {
        // setSortType(e.target.value);
        const value = e.target.value;
        setSortType(value);
        setInput({
            ...input,
            sortType: value,
        });
    }
    const onChangeEmailType = (e) => {
        // setEmailType(e.target.value);
        const value = e.target.value;
        setEmailType(value);
        setInput({
            ...input,
            emailType2: value,
        });
    }

    const [input, setInput] = useState({
        sortType,
        emailType:"",
        emailType2,
        content: "",
    });

    useEffect(()=>{
        if(initData){
            setInput({
                ...initData
            });
        }
    }, [initData])

    const onChangeInput=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        
        setInput({
            ...input,
            [name]: value,
        });
    }

    const onClickSubmitButton = () => {
        const currentTime = new Date().toLocaleString();
        const updatedInput = {
            ...input,
            submitTime: currentTime,
        };
        onSubmit(updatedInput);
        };

    return( <div className="Editor">
        <section className="sort_section">
            <div>문의 분류 *ㅤㅤ</div>
            <div className="menu_bar">
                <select value={sortType}
                onChange = {onChangeSortType}>
                    <option>거래</option>
                    <option>계정</option>
                    <option>퀘스트</option>
                    <option>스토리</option>
                    <option>기타</option>
                </select>
            </div>
        </section>
        <section className="email_section">
            <div>답변 받을 이메일 주소 *</div>
            <input onChange={onChangeInput}
            value={input.emailType} name="emailType"></input>
            <div>@</div>
            <div className="email_bar">
                <select onChange = {onChangeEmailType}>
                <option value={"naver.com"}>naver.com</option>
                <option value={"gmail.com"}>gmail.com</option>
                <option value={"duksung.ac.kr"}>duksung.ac.kr</option>
                <option value={"daum.net"}>daum.net</option>
                <option value={"hanmail.net"}>hanmail.net</option>
                <option value="custom">직접 입력</option>
                </select>
            </div>
        </section>
        <section className="content_section">
            <div>문의 내용 *ㅤㅤ</div>
            <div>ㅤㅤ</div>
            <textarea name="content" value={input.content}
            onChange={onChangeInput}
            placeholder="문의 내용을 작성해주세요."></textarea>
        </section>
        <section className="button_section">
            <Button text={"문의 접수"} onClick={onClickSubmitButton}/>
        </section>
    </div>
    )
}

export default QnaCreateEdior;