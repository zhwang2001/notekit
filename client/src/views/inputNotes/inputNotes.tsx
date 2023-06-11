import {Button, Divider, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {inputValidation} from "./utils/validation";
import {getQuiz} from "../../api";

//TODO
//ability edit and make own flashcards
//organize styles
//validation
//utilize better prompt
//extract text pdf
//fix: clicking back button does not reset the flashcard

//add error message
//aria text label
//best colors
type pageChangeFunction = (direction: string) => void;
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
    setResponse: React.Dispatch<React.SetStateAction<string[][]>>
}) {

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
    //const [errorMessage, setErrorMessage] = useState("");
    //define state management for managing the user input
    const [textInput, setTextInput] = useState(initialString)

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
        const response = await getQuiz({prompt: textInput});
        console.log(response);
        const questionsAndAnswers: Object = response.data;
        const nestedArray: string[][] = Object.values(questionsAndAnswers);
        props.setResponse(nestedArray);
    }


    return (
        <div style={{width: '30vw', textAlign: 'center'}}>
            <Typography variant="h3" color="text.primary" sx={{width: '100%', fontWeight: 550}}>
                Notekit will generate a quiz from your notes
            </Typography>
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
                    handleCharacterCount(e);
                }}
                error={error}
            ></TextField>
            <Button disabled={error}
                    onClick={() => {
                        props.handlePageChange('forward');
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
                <Typography variant={"h6"} sx={{fontSize: '15px'}}>Generate</Typography>
            </Button>
        </div>
    )
}
