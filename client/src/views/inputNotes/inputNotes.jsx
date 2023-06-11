import {Button, Divider, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {inputValidation} from "./utils/validation";
import {BsArrowRight} from "react-icons/bs";
import {Configuration, OpenAIApi} from "openai";

//TODO
//ability edit and make own flashcards
//organize styles
//validation
//minimum string length is 300
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

    /**
     * @brief A function responsible for calling the api
     *
     * @see setResponse sets the response to be utilized by other components
     */
    const submitPrompt = () => {
        openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Can you generate a list of questions and answers using the following input text?: ${textInput}
                 ,start each question with "Q" and each answer with "A"`
            }]
        }).then(res => {
            //convert the string response into a nested array
            const response = res.data.choices[0].message.content
            const arrResponse = response.split('\n\n')

            const nestedArray = []
            arrResponse.map(res => {
                nestedArray.push(res.split('\n'))
            })
            setResponse(nestedArray)
        })
    }


    return (
        <div style={{width: '30vw', textAlign: 'center'}}>
            <Typography variant="h3" color="text.primary" sx={{width: '100%'}}>
                Enter a URL or your Notes and Eurodam will generate a quiz automatically from them
            </Typography>
            <div style={{padding: '20px'}}>
                <TextField
                    fullWidth
                    placeholder={"ex. https://en.wikipedia.org/wiki/Ship"}
                    variant={"standard"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton sx={{
                                    fontSize: '15px',
                                    padding: '5px',
                                    '&:hover': {backgroundColor: '#253859', color: 'aqua'}
                                }}>
                                    <BsArrowRight/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>
            <Divider orientation={"horizontal"}
                     sx={{width: '100%', fontSize: '20px', padding: '20px 0px 45px 0px'}}>or</Divider>
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
                        submitPrompt();
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
                <Typography>Generate</Typography>
            </Button>
        </div>
    )
}
