import {Button, Divider, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {inputValidation} from "./utils/validation";
import {Configuration, OpenAIApi} from "openai";

//TODO
//ability edit and make own flashcards
//organize styles
//validation
//utilize better prompt

//add error message
//aria text label
//best colors

/**
 * @constructor
 *
 * @brief A functional UI component that allows user to submit text through a link or copy and paste their notes
 *
 * @param {function} handlePageChange this parameter allows the parent component to access the child's onClick event listener
 * @param {setState} setTextInput this parameter sets the text input to the user's input
 * @returns {JSX.Element} this function returns 2 different input fields
 */
export default function InputNotes({handlePageChange, setResponse}) {

    //defaultValue for the textField component
    const initialString = "Example: Einstein was born on March 14, 1879, in Ulm, Germany, a town that today has " +
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
    const [characterCount, setCharacterCount] = useState(`${initialString.length} / ${characterLimit}`);
    //define state management for managing error state
    const [error, setError] = useState(false);
    //define state management for displaying error messages
    const [errorMessage, setErrorMessage] = useState("");
    //define state management for managing the user input
    const [textInput, setTextInput] = useState(initialString)

    //chatGPT initialization
    const API_KEY = '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'
    const openai = new OpenAIApi(new Configuration({
        apiKey: API_KEY
    }))

    /**
     * @async
     *
     * @Brief Makes a POST request to the specified URL and returns the JSON response.
     *
     * @returns {Promise<any>} A Promise that resolves to the JSON response.
     */
    async function postData() {
        const response = await fetch('http://127.0.0.1:5000/quiz', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: {prompt: textInput},
            }
        )
        return response.json();
    }


    /**
     * @brief An event handler that displays the number of characters already used and validates the input
     *
     * @param {Object} e this parameter contains the event data
     * @see setCharacterCount sets the new character count string
     * @see setError sets error as true or false
     * @see setRecordedInput sets text input to user input
     */
    function handleCharacterCount(e) {
        const typedCharacters = e.target.value.length;
        const charactersUsed = `${typedCharacters} / ${characterLimit}`;
        setCharacterCount(charactersUsed);
        //if RegExp test returns true
        if (inputValidation({typedCharacters}) === true) {
            setError(false)
            setTextInput(e.target.value);
            //if RegExp test returns false
        } else if (inputValidation({typedCharacters}) === false) {
            setError(true)
        }
    }

    return (
        <div style={{width: '30vw', textAlign: 'center'}}>
            <Typography variant="h3" color="text.primary" sx={{width: '100%', fontWeight: '600'}}>
                Notekit will generate a quiz from your notes
            </Typography>
            <Divider sx={{margin: '50px 0px 50px 0px', width: '100%'}}/>
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
                    handleCharacterCount(e);
                }}
                error={error}
            ></TextField>
            <Button disabled={error}
                    onClick={() => {
                        handlePageChange('forward');
                        postData().then((e) => console.log(e));
                    }}
                    sx={{
                        float: 'right',
                        "&.Mui-disabled": {backgroundColor: 'lightGrey', color: 'darkGrey'},
                        backgroundColor: '#253859',
                        color: 'aqua',
                        padding: '10px',
                        margin: '10px',
                        '&:hover': {backgroundColor: 'black', color: 'aqua'},

                    }}>
                <Typography variant={"h6"}>Generate</Typography>
            </Button>
        </div>
    )
}
