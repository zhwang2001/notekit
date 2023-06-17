import React, {JSX, useState} from 'react';
import {Button, Card, CardContent, Divider, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {IoCopy, IoCopyOutline, IoPencilOutline, IoTrashOutline} from "react-icons/io5";
import {IoIosArrowBack, IoLogoTwitter} from "react-icons/io";

interface FlashCardsProps {
    handlePageChange: (direction: string) => void;
    response: string[][];
    setResponse: React.Dispatch<React.SetStateAction<string[][] | []>>;
}

/**
 * @brief A functional UI component that displays the quiz name and all the flashcards.
 *
 * @param {FlashCardsProps} props - The component props.
 * @returns {JSX.Element} The title and an array of flashcards.
 */
const FlashCards: React.FC<FlashCardsProps> = (props: FlashCardsProps): React.ReactElement => {

    const {handlePageChange, response, setResponse} = props;
    //Action event handlers
    /**
     * @brief event handler for deleting a flashcard
     *
     * @param {number} index the index within the array to splice
     * @see setResponse after splicing new array sets the response to new array
     */
    const handleDeleteFlashCard = (index: number): void => {
        const newResponse: string[][] = [...response];
        newResponse.splice(index, 1)
        setResponse(newResponse)
    }
    /**
     * @brief event handler for copying flashcard to clipboard
     *
     * @param {number} index the index within the array to splice
     */
    const handleCopyToClipboard = (index: number): void => {
        const question: string = response[index][0]
        const answer: string = response[index][1]
        const flashCard = `Q: ${question}, A: ${answer}`

        navigator.clipboard.writeText(flashCard)
            .then((): void => {
                console.log('Text copied to clipboard!', flashCard)
            })
            .catch((error): void => {
                console.log('Failed to copy text to clipboard', error)
            })
    }


    return (
        <CardContent sx={{height: '100vh', padding: '10%'}}>
            <div style={{
                width: '100%',
                display: 'flex',
                flexFlow: 'row wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{float: 'left', display: 'flex', alignItems: 'center',}}>
                    <IconButton onClick={() => {
                        handlePageChange("backward");
                    }}>
                        <IoIosArrowBack size={35}/>
                    </IconButton>
                    <Typography variant="h2" color="text.primary">
                        Quiz
                    </Typography>
                </div>
                <div>
                    <Tooltip title={"Copy Entire Quiz"}
                             arrow>
                        <IconButton>
                            <IoCopy/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Share this Quiz"}
                             arrow>
                        <IconButton>
                            <IoLogoTwitter/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            {response.map((data: string[], index: number) => (
                <FlashCard
                    data={data}
                    index={index}
                    handleDeleteFlashCard={handleDeleteFlashCard}
                    handleCopyToClipboard={handleCopyToClipboard}
                    response={response}
                    setResponse={setResponse}
                />
            ))}
        </CardContent>
    );
};
export default FlashCards


type ActionHandler = (index: number) => void;

interface FlashCardProps {
    data: Array<string>;
    index: number;
    handleDeleteFlashCard: ActionHandler;
    handleCopyToClipboard: ActionHandler;
    response: string[][];
    setResponse: React.Dispatch<React.SetStateAction<string[][] | []>>;
}

/**
 * @constructor
 *
 * @brief A functional UI component that returns an individual flashcard
 *
 * @param {object} props the props object
 * @returns {JSX.Element} the question and answer to the flashcard as well as buttons to interact with the flashcard
 */
function FlashCard(props: FlashCardProps): JSX.Element {

    const {
        data,
        index,
        handleDeleteFlashCard,
        handleCopyToClipboard,
        response,
        setResponse,
    } = props;

    //State management for managing the edit state
    const [editing, setEditing] = useState<boolean>(false)
    //State management for storing new questions
    const [newQuestion, setNewQuestion] = useState<string>('')
    //State management for storing new answers
    const [newAnswer, setNewAnswer] = useState<string>('')


    interface ActionButtonProps {
        toolTipMsg: string;
        eventHandler: ActionHandler;
        children: React.ReactNode;
    }

    /**
     * @constructor
     *
     * @brief A reusable functional component performs some action on the flashcard
     *
     * @param {object} props the props object
     * @returns {JSX.Element} an icon button and a tooltip
     */
    const ActionButton: React.FC<ActionButtonProps> = (props: ActionButtonProps): JSX.Element => {
        return (
            <Tooltip
                title={props.toolTipMsg}
                placement={"right"}
                arrow>
                <IconButton onClick={() => props.eventHandler(index)}>
                    {props.children}
                </IconButton>
            </Tooltip>
        )
    }

    /**
     * @brief event handler for allowing questions and answers of flashcard to be edited
     *
     * @see setEditing toggle editing between true and false
     */
    const handleEditChange = (): void => {
        setEditing(!editing)
    };

    /**
     * @brief event handler for saving edited changes
     *
     * @param {number} index
     * @see setResponse sets the response to a new question and answer
     */
    const handleSaveAndSubmit = (index: number): void => {
        const newResponse = [...response]
        newResponse[index][0] = newQuestion
        newResponse[index][1] = newAnswer
        setResponse(newResponse)
        setEditing(false)
    }
    /**
     * @brief event handler for canceling editing
     *
     * @see setEditing clicking cancel sets editing to false
     */
    const handleCancelEdit = () => {
        setEditing(false)
    }


    return (
        <CardContent sx={{display: 'flex', flexDirection: 'column'}}>
            <div style={{width: '30vw', display: 'flex', flexFlow: 'row nowrap'}}>
                <Card sx={{
                    width: '100%',
                    backgroundColor: '#f2f2f2',
                    padding: '20px',
                }}>
                    {editing
                        ? <TextField fullWidth variant={"standard"} size={"small"} defaultValue={data[0]} multiline
                                     InputProps={{disableUnderline: true}}
                                     sx={{padding: '10px 0px 10px 0px'}}
                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuestion(e.target.value)}
                        />
                        : <Typography variant={"h6"} color={"text.primary"}
                                      sx={{fontWeight: '600', padding: '10px 0px 10px 0px'}}>
                            {data[0]}
                        </Typography>}
                    <Divider sx={{margin: '10px 0px 10px 0px'}} light/>
                    {editing
                        ? <TextField fullWidth variant={"standard"} size={"small"} defaultValue={data[1]} multiline
                                     InputProps={{disableUnderline: true}}
                                     sx={{padding: '10px 0px 10px 0px'}}
                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAnswer(e.target.value)}
                        />
                        : <Typography variant={"h6"} color={"text.secondary"} sx={{padding: '5px 0px 5px 0px'}}>
                            {data[1]}
                        </Typography>}
                </Card>
                <div style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    justifyContent: 'space-around',
                    padding: '10px',
                }}>
                    <ActionButton
                        toolTipMsg={"Copy This Flashcard"}
                        eventHandler={handleCopyToClipboard}>
                        <IoCopyOutline/>
                    </ActionButton>
                    <ActionButton
                        toolTipMsg={"Edit This Flashcard"}
                        eventHandler={handleEditChange}>
                        <IoPencilOutline/>
                    </ActionButton>
                    <ActionButton
                        toolTipMsg={"Delete This Flashcard"}
                        eventHandler={handleDeleteFlashCard}>
                        <IoTrashOutline/>
                    </ActionButton>
                </div>
            </div>
            {editing
                ? <div
                    style={{
                        marginTop: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                    <Button onClick={() => handleSaveAndSubmit(index)}>Save & Submit</Button>
                    <Button onClick={handleCancelEdit}>Cancel</Button>
                </div>
                : null
            }
        </CardContent>
    )
}

