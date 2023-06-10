import './App.css';
import {useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"
import {Configuration, OpenAIApi} from "openai";

function App() {
    //define state management for which page is being shown
    const [pageIndex, setPageIndex] = useState(0)
    /**
     * @brief An event handler for changing the page once generate button has been clicked
     *
     * @see setPageIndex sets the index to the current index + 1
     */
    const handlePageChange = () => {
        setPageIndex(pageIndex + 1)
    }


    //initialization
    const API_KEY = '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'
    const openai = new OpenAIApi(new Configuration({
        apiKey: API_KEY
    }))
    //define state management for storing gpt response
    const [response, setResponse] = useState([])
    //array that stores the different pages viewed by user
    const pages = [
        <InputNotes clickGenerate={handlePageChange} setResponse={setResponse}/>,
        <FlashCards response={response}/>
    ]


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
