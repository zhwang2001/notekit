import './App.css';
import React, {JSX, useEffect, useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"
import {IconButton, LinearProgress, Tooltip, Typography} from "@mui/material";
import backgroundImage from './assets/background_image.jpg'
import {IoIosArrowBack} from "react-icons/io";

function App(): JSX.Element {
    //define state management for which page is being shown
    const [pageIndex, setPageIndex] = useState<number>(0)
    //define state management for timing out request
    const [loadingTimedOut, setLoadingTimedOut] = useState<boolean>(false)
    //define state management for starting the timer
    const [startTimer, setStartTimer] = useState<boolean>(false)

    /**
     * @brief An event handler for changing the page once generate button has been clicked
     *
     * @details if direction is backwards then response is cleared and timer is reset
     *
     * @see setPageIndex sets the index to the current index + 1
     * @see setResponse sets the response store back to empty array
     * @see setLoadingTimedOut sets the loading timeout back to false
     * @see setStartTimer sets the start timer state
     */
    const handlePageChange = (direction: string): void => {
        if (direction === "forward") {
            setPageIndex(pageIndex + 1)
            setStartTimer(true)
        } else if (direction === "backward") {
            setPageIndex(pageIndex - 1)
            setResponse([])
            setLoadingTimedOut(false)
            setStartTimer(false)
        }
    }
    //define state management for storing gpt response
    const [response, setResponse] = useState<string[][] | []>([]);

    //timeout after 60 seconds
    useEffect(() => {
        if (startTimer) {
            const timeoutId = setTimeout(() => {
                setLoadingTimedOut(true)
            }, 60000);

            return () => {
                clearTimeout(timeoutId)
            }
        }
    }, [handlePageChange])

    /**
     *
     * @returns {React.FC<JSX.Element>}
     */
    const Loading: React.FC<unknown> = (): JSX.Element => {
        return (
            <div style={{
                width: '30vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                flexFlow: 'row nowrap'
            }}>
                <Tooltip title="Go Back" arrow>
                    <IconButton onClick={() => handlePageChange('backward')} sx={{padding: '5px', margin: '10px'}}>
                        <IoIosArrowBack/>
                    </IconButton>
                </Tooltip>
                {loadingTimedOut
                    ? <Typography variant="h5" color="text.primary">ChatGPT didn't accept your prompt. Please try
                        again</Typography>
                    : <LinearProgress sx={{width: '100%'}}/>}
            </div>
        )
    }

    //array that stores the different pages viewed by user
    const pages: Readonly<JSX.Element[]> = [
        <InputNotes handlePageChange={handlePageChange} setResponse={setResponse}/>,
        response.length !== 0
            ? <FlashCards handlePageChange={handlePageChange} response={response}/>
            : <Loading/>
    ]

    return (
        <div style={{
            /*
            width: '700px',
            height: '600px',
            */
            width: '100vw',
            height: '100vh',
            padding: '5% 0% 5% 0%',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'column nowrap',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            overflowY: 'scroll',
        }}>
            {pages[pageIndex]}
        </div>
    );
}

export default App;
