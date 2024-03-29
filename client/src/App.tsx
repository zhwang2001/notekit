import './App.css';
import {JSX, useEffect, useState} from 'react'
import InputNotes from "./views/inputNotes/inputNotes";
import FlashCards from "./views/flashCards/flashCards"
import {Alert, AlertTitle, LinearProgress, Snackbar, Typography} from "@mui/material";
import backgroundImage from './assets/background_image.jpg'
import {useSelector} from 'react-redux';
import type {RootState} from "./store";


function App(): JSX.Element {
    //define state management for which page is being shown
    const [pageIndex, setPageIndex] = useState<number>(0)
    //define state management for timing out request
    const [loadingTimedOut, setLoadingTimedOut] = useState<boolean>(false)
    //define state management for starting the timer
    const [startTimer, setStartTimer] = useState<boolean>(false)
    //define state management for storing gpt response
    const [response, setResponse] = useState<string[][] | []>([]);
    //define state management for checking if axios response status is 200
    const [responseSuccess, setResponseSuccess] = useState<boolean>(false)

    /**
     * @brief An event handler for changing the page once generate button has been clicked
     *
     * @details if direction is backwards then response is cleared and timer is reset
     *
     * @see setPageIndex sets the index to the current index + 1
     * @see setResponse sets the response store back to empty array
     * @see setLoadingTimedOut sets the loading timeout back to false
     * @see setStartTimer sets the start timer state
     * @see setResponseSuccess sets the responseSuccess back to false
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
            setResponseSuccess(false)
        }
    }

    //timeout after 60 seconds
    useEffect(() => {
        if (startTimer) {
            const timeoutId = setTimeout(() => {
                setLoadingTimedOut(true)
            }, 60000);

            return () => {
                clearTimeout(timeoutId)
                setStartTimer(false)
                console.log('Timer Reset')
            }
        }
    }, [handlePageChange, startTimer])


    /**
     * @brief an intermediary page that's shown while request is being fulfilled
     * @returns {React.FC<JSX.Element>} a loading indicator, back button and conditional error message
     */
    function Loading(): JSX.Element {
        return (
            <div style={{
                width: '30vw',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
            }}>
                {/*<Tooltip title="Go Back" arrow>*/}
                {/*    <IconButton onClick={() => handlePageChange('backward')} sx={{padding: '5px', margin: '10px'}}>*/}
                {/*        <IoIosArrowBack/>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}
                <Typography variant="h3" color="text.primary" sx={{padding: '30px'}}>
                    Creating Quiz!
                </Typography>
                {loadingTimedOut
                    ? <Typography
                        variant="h5"
                        color="text.primary">
                        ChatGPT didn't accept your prompt. Please try again
                    </Typography>
                    : <LinearProgress sx={{width: '100%'}}/>}
            </div>
        )
    }

    //array that stores the different pages viewed by user
    const pages: Readonly<JSX.Element[]> = [
        <InputNotes handlePageChange={handlePageChange}
                    setResponse={setResponse}
                    setResponseSuccess={setResponseSuccess}/>,
        responseSuccess
            ? <FlashCards handlePageChange={handlePageChange}
                          response={response}
                          setResponse={setResponse}/>
            : <Loading/>
    ]

    const alert = useSelector((state: RootState) => state.alerts.alert)
    const [showSnackbar, setShowSnackbar] = useState(true);

    useEffect(() => {
        if (!alert.length) {
            setShowSnackbar(true);
        }
    }, [alert])

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'column nowrap',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            overflowY: 'scroll',
        }}>
            {alert.length > 0
                ?
                <Snackbar open={showSnackbar} onClose={() => {
                    if (!alert.length) {
                        setShowSnackbar(false)
                    }
                    ;
                }} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert severity={alert[1]} variant="filled">
                        <AlertTitle>{alert[0]}</AlertTitle>
                        {alert[2]}
                    </Alert>
                </Snackbar>
                : null}
            {pages[pageIndex]}
        </div>
    );
}

export default App;
