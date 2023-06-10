import './App.css';
import {useEffect, useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"
import {Configuration, OpenAIApi} from "openai";
function App() {
    //define state management for which page is being shown
    const [pageIndex, setPageIndex] = useState(0)
    //define state management for recording the values of user input
    //const [textInput, setTextInput ] = useState('')

    const handlePageChange = () => {
        setPageIndex(pageIndex + 1)
    }
    const pages = [<InputNotes clickGenerate={handlePageChange} />, <FlashCards/>]

    const API_KEY ='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'
    const openai = new OpenAIApi(new Configuration({
        apiKey: API_KEY
    }))

    // useEffect(() =>{
    //         openai.createChatCompletion({
    //             model: "gpt-3.5-turbo",
    //             messages: [{role: "user", content: `Can you generate a list of questions and answers using the following input text?: ${textInput}`}]
    //         }).then(res => {
    //             console.log(res.data.choices[0].message.content)
    //         })
    // },[textInput])


    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'column nowrap',
        }}>
            {pages[pageIndex]}
        </div>
    );
}

export default App;
