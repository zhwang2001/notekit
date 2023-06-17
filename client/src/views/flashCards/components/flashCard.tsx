import React, {JSX, useState} from "react";
import {Button, Card, CardContent, Divider, TextField, Typography} from "@mui/material";
import {clipboardWriter} from "../utils/functionalUtils.tsx";
import {IoCopyOutline, IoPencilOutline, IoTrashOutline} from "react-icons/io5";
import {ActionButton} from "./actionButton.tsx";

interface FlashCardProps {
    data: Array<string>;
    index: number;
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
export function FlashCard(props: FlashCardProps): JSX.Element {

    const {
        data,
        index,
        response,
        setResponse,
    } = props;

    //State management for managing the edit state
    const [editing, setEditing] = useState<boolean>(false)
    //State management for storing new questions
    const [newQuestion, setNewQuestion] = useState<string>(response[index][0])
    //State management for storing new answers
    const [newAnswer, setNewAnswer] = useState<string>(response[index][1])


    /**
     * @brief event handler for deleting a flashcard
     *
     * @see setResponse after splicing new array sets the response to new array
     */
    const handleDeleteFlashCard = (): void => {
        setEditing(false)
        const newResponse: string[][] = [...response];
        newResponse.splice(index, 1)
        console.log(newResponse)
        setResponse(newResponse)
    }
    /**
     * @brief event handler for copying flashcard to clipboard
     *
     * @see clipboardWriter function for copying flashcard string to clipboard
     */
    const handleCopyToClipboard = (): void => {
        const question: string = response[index][0]
        const answer: string = response[index][1]
        const flashcardString = `Q: ${question} | A: ${answer}`
        clipboardWriter(flashcardString)
    }


    /**
     * @brief event handler for allowing questions and answers of flashcard to be edited
     *
     * @see setEditing toggle editing between true and false
     */
    const handleEditChange = (): void => {
        setEditing(!editing)
    };

    //Event handlers for editing flashcards functionality
    /**
     * @brief event handler for saving edited changes
     *
     * @see setResponse sets the response to a new question and answer
     */
    const handleSaveAndSubmit = (): void => {
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
    const handleCancelEdit = (): void => {
        setEditing(false)
    }

    type Fields = 'question' | 'answer'
    type EventValue = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    /**
     * @brief event handler for recording question and answer fields
     *
     * @param {EventValue} e event
     * @param {Fields} fieldType this parameter tells the function to record either the question or answer
     * @see setNewQuestion records the new question from user input
     * @see setNewAnswer records the new answer from user input
     */
    const handleRecordFields = (e: EventValue, fieldType: Fields): void => {
        if (fieldType === "question") {
            setNewQuestion(e.target.value)
        } else if (fieldType === "answer") {
            setNewAnswer(e.target.value)
        }
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
                                     onChange={(e) => handleRecordFields(e, 'question')}
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
                                     onChange={(e) => handleRecordFields(e, 'answer')}
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
                        eventHandler={handleCopyToClipboard}
                        index={index}
                        toolTipMsg={"Copy This Flashcard"}
                    >
                        <IoCopyOutline/>
                    </ActionButton>
                    <ActionButton
                        eventHandler={handleEditChange}
                        index={index}
                        toolTipMsg={"Edit This Flashcard"}
                    >
                        <IoPencilOutline/>
                    </ActionButton>
                    <ActionButton
                        eventHandler={handleDeleteFlashCard}
                        index={index}
                        toolTipMsg={"Delete This Flashcard"}
                    >
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
                    <Button onClick={handleSaveAndSubmit}>Save & Submit</Button>
                    <Button onClick={handleCancelEdit}>Cancel</Button>
                </div>
                : null
            }
        </CardContent>
    )
}
