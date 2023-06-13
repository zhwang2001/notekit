import {Button, Divider, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {inputValidation} from "./utils/validation";
import {getQuiz} from "../../api";
import React from 'react'
import * as pdfjslib from 'pdfjs-dist'
import {TextContent} from "pdfjs-dist/types/web/text_layer_builder";
import {TextItem, TextMarkedContent} from "pdfjs-dist/types/src/display/api";

//TODO
//ability edit and make own flashcards
//validation
//utilize better prompt
//extract text pdf

//add error message
//aria text label
//best colors

pdfjslib.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js'
async function getContent(src: string): Promise<TextContent | undefined>{
    try{
        const doc = await pdfjslib.getDocument(src).promise
        const page = await doc.getPage(1)
        return await page.getTextContent()
    } catch (error) {
        console.log('an error occurred', error)
    }
}

async function getItems(src:string): Promise<void[]>{
    const content: TextContent | undefined = await getContent(src)
    if (!content){
        return [];
    }
    return content.items.map((item: TextItem | TextMarkedContent): Promise<void> => {
        console.log(item.str);
        return Promise.resolve();
    })
}
getItems('/example.pdf')
    .then((response) => console.log(response))
    .catch((error) => console.log(error))

type pageChangeFunction = (direction: string) => void;
type setStateResponse = React.Dispatch<React.SetStateAction<string[][]>>;

/**
 * @constructor
 *
 * @brief A functional UI component that allows user to submit text through a link or copy and paste their notes
 *
 * @param {object} props the props object. Has properties handlePageChange {function} this parameter allows the parent component to access the child's onClick event listener and {setResponse} this parameter sets the text input to the user's input
 *
 * @returns {React.FC} this function returns 2 different input fields
 */
export default function InputNotes(props: {
    handlePageChange: pageChangeFunction,
    setResponse: setStateResponse,
}) {

    //defaultValue for the textField component
    const initialString : Readonly<string> = "Example: Einstein was born on March 14, 1879, in Ulm, Germany, a town that today has " +
        "a population of just more than 120,000. There is a small commemorative plaque where his house " +
        "used to stand (it was destroyed during World War II). The family moved to Munich shortly " +
        "after his birth, according to the Nobel Prize website, \n\n" +
        "and later to Italy when his father " +
        "faced problems with running his own business. Einstein's father, Hermann, ran an " +
        "electrochemical factory and his mother Pauline took care of Albert and his younger sister, " +
        "Maria."
    //set the characterLimit for the textField component
    const characterLimit = 100000;

    //define state management for managing the character counter
    const [characterCount, setCharacterCount] = useState<string>(`${initialString.length} / ${characterLimit}`);
    //define state management for managing error state
    const [error, setError] = useState<boolean>(false);
    //define state management for displaying error messages
    //const [errorMessage, setErrorMessage] = useState("");
    //define state management for managing the user input
    const [textInput, setTextInput] = useState<string>(initialString)

    /**
     * @brief An event handler that displays the number of characters already used and validates the input
     *
     * @param {Object} e this parameter contains the event data
     * @see setCharacterCount sets the new character count string
     * @see setError sets error as true or false
     * @see setRecordedInput sets text input to user input
     */
    function handleCharacterCount(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const typedCharacters = e.target.value.length;
        const charactersUsed = `${typedCharacters} / ${characterLimit}`;
        setCharacterCount(charactersUsed);
        //if RegExp test returns true
        if (inputValidation(typedCharacters)) {
            setError(false)
            setTextInput(e.target.value);
            //if RegExp test returns false
        } else if (!inputValidation(typedCharacters)) {
            setError(true)
        }
    }

    /**
     * @brief A function responsible for calling the api
     *
     * @see setResponse sets the response to be utilized by other components
     */
    const submitPrompt = async () => {
        try{
            const response = await getQuiz({prompt: textInput});
            console.log(response);
            const questionsAndAnswers: object = response.data;
            const nestedArray: string[][] = Object.values(questionsAndAnswers);
            props.setResponse(nestedArray);
        } catch (error) {
            console.log("An error occured", error)
        }
    }


    return (
        <div style={{width: '600px', height: '500px', textAlign: 'center'}}>
            <Typography variant="h4" color="text.primary" sx={{width: '100%', fontWeight: 550}}>
                Notekit will generate a quiz from your notes
            </Typography>
            <script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
            <Divider orientation={"horizontal"}
                     sx={{width: '100%', fontSize: '20px', margin: '40px 0px 40px 0px'}}/>
            <TextField
                aria-label={"Enter Text Here"}
                fullWidth
                multiline
                helperText={characterCount}
                type={"string"}
                variant={"filled"}
                defaultValue={initialString}
                rows={10}
                onChange={(e) => {
                    handleCharacterCount(e)
                }}
                error={error}
            ></TextField>
            <Button disabled={error}
                    onClick={() => {
                        props.handlePageChange('forward');
                        submitPrompt().catch(error => console.log('An error has occurred: ', error))
                    }}
                    sx={{
                        float: 'right',
                        "&.Mui-disabled": {backgroundColor: 'lightGrey', color: 'white'},
                        backgroundColor: '#253859',
                        color: 'aqua',
                        padding: '10px',
                        margin: '10px',
                        '&:hover': {backgroundColor: 'black', color: 'aqua'},

                    }}>
                <Typography variant={"h6"} sx={{fontSize: '15px'}}>Generate</Typography>
            </Button>
        </div>
    )
}
