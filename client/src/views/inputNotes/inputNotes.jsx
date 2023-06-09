import {Button, Divider, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {inputValidation} from "./validation";
import {BsArrowRight} from "react-icons/bs";

export default function InputNotes({clickGenerate}) {

    const defaultValue = "Example: Einstein was born on March 14, 1879, in Ulm, Germany, a town that today has " +
        "a population of just more than 120,000. There is a small commemorative plaque where his house " +
        "used to stand (it was destroyed during World War II). The family moved to Munich shortly " +
        "after his birth, according to the Nobel Prize website, \n\n" +
        "and later to Italy when his father " +
        "faced problems with running his own business. Einstein's father, Hermann, ran an " +
        "electrochemical factory and his mother Pauline took care of Albert and his younger sister, " +
        "Maria."
    const characterLimit = 100000;
    const [characterCount, setCharacterCount] = useState(`${defaultValue.length} / ${characterLimit}`)
    const [validInput, setValidInput] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    /**
     *
     */
    function handleCharacterCount(e) {
        const typedCharacters = e.target.value.length;
        const charactersUsed = `${typedCharacters} / ${characterLimit}`;
        setCharacterCount(charactersUsed);
        setValidInput(!inputValidation({typedCharacters}));
    }

    //TODO
    //__minimum string length is 300
    //__maximum string length is 10000
    //comment code
    //chatgpt portion without actual api
    //validation
    //add error message
    //aria text label
    //company name
    //best colors


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
                defaultValue={defaultValue}
                rows={10}
                onChange={handleCharacterCount}
                error={validInput}
            ></TextField>
            <Button disabled={validInput}
                    onClick={clickGenerate}
                    sx={{
                        float: 'right',
                        "&.Mui-disabled": {backgroundColor: 'lightGrey', color: 'white'},
                        backgroundColor: '#253859',
                        color: 'aqua',
                        padding: '10px',
                        margin: '10px',
                        '&:hover': {backgroundColor: 'black', color: 'aqua'},

                    }}><Typography>Generate</Typography></Button>
        </div>
    )
}
