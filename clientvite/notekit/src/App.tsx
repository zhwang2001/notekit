import './App.css';
import {useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"
import {LinearProgress} from "@mui/material";

function App() {
    //define state management for which page is being shown
    const [pageIndex, setPageIndex] = useState(0)
    /**
     * @brief An event handler for changing the page once generate button has been clicked
     *
     * @see setPageIndex sets the index to the current index + 1
     */
    const handlePageChange = (direction: string) => {
        if (direction === "forward") {
            setPageIndex(pageIndex + 1)
        } else if (direction === "backward") {
            setPageIndex(pageIndex - 1)
        }
    }

    //define state management for storing gpt response
    const [response, setResponse] = useState([])
    //array that stores the different pages viewed by user
    const pages = [
        <InputNotes handlePageChange={handlePageChange} setResponse={setResponse}/>,
        response.length !== 0
            ? <FlashCards handlePageChange={handlePageChange} response={response}/>
            : <div style={{width: '30vw'}}><LinearProgress sx={{width: '100%'}}/></div>
    ]


    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'column nowrap',
            backgroundImage: 'url("https://img.freepik.com/free-vector/winter-blue-pink-gradient-background-vector_53876-117276.jpg?w=1800&t=st=1686457391~exp=1686457991~hmac=9713980c47b11619b1f3582574b0bcc57f8571209cc1a3a32c4f52a8786abc10")',
            backgroundSize: '100% auto',
            overflowY: 'scroll',
        }}>
            {pages[pageIndex]}
        </div>
    );
}

export default App;
