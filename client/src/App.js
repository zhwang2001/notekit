import './App.css';
import {useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"

function App() {
    //define state management for which page is being shown
    const [pageIndex, setPageIndex] = useState(0)
    /**
     * @brief An event handler for changing the page once generate button has been clicked
     *
     * @see setPageIndex sets the index to the current index + 1
     */
    const handlePageChange = (direction) => {
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
        <FlashCards handlePageChange={handlePageChange} response={response}/>
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
