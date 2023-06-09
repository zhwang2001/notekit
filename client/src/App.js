import './App.css';
import {useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"

function App() {
    const [pageIndex, setPageIndex] = useState(0)

    const handlePageChange = () => {
        setPageIndex(pageIndex + 1)
    }
    const pages = [<InputNotes clickGenerate={handlePageChange}/>, <FlashCards/>]

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
