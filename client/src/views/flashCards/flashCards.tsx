import {Card, CardContent, Divider, IconButton,  Typography} from "@mui/material";
import {IoCopyOutline, IoPencilOutline, IoTrashOutline} from "react-icons/io5";
import {IoIosArrowBack} from "react-icons/io";
type pageChangeFunction = (direction: string) => void;
/**
 * @brief A functional UI component that displays the quiz name and all the flashcards
 *
 * @param {array} response this parameter contains the nested array obtained from ChatGPT's response
 * @param {function} handlePageChange this parameter contains the logic for changing pages
 * @returns {JSX.Element} the title and an array of flashcards
 * @constructor
 */
export default function FlashCards(props: {handlePageChange: pageChangeFunction, response: string[][]}) {
    return (
        <CardContent sx={{height: '100vh', padding: '10%'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <IconButton onClick={() => props.handlePageChange("backward")}>
                        <IoIosArrowBack size={35}/>
                    </IconButton>
                </div>
                <Typography variant={"h2"} color={"text.primary"} sx={{margin: '30px 0px 30px 10px', width: '100%'}}>
                    Quiz
                </Typography>
            </div>
            {props.response.map((data) => {
                return (<FlashCard data={data}/>)
            })}
        </CardContent>
    )
}

/**
 * @constructor
 *
 * @brief A functional UI component that returns an individual flashcard
 *
 * @param {array} data parameter has an array containing the question and answer to flashcard
 * @returns {JSX.Element} the question and answer to the flashcard as well as buttons to interact with the flashcard
 */
function FlashCard(props: {data: Array<string>}){
    return (
        <CardContent sx={{width: '30vw', display: 'flex', flexFlow: 'row nowrap'}}>
            <Card sx={{
                width: '100%',
                backgroundColor: '#f2f2f2',
                padding: '20px',
            }}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Typography variant={"h6"} color={"text.primary"} sx={{fontWeight: '600'}}>
                        {props.data[0]}
                    </Typography>
                </div>
                <Divider sx={{margin: '10px 0px 10px 0px'}} light/>
                <Typography variant={"h6"} color={"text.secondary"}>
                    {props.data[1]}
                </Typography>
            </Card>
            <div style={{
                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'space-around',
                padding: '10px',
            }}>
                <IconButton><IoCopyOutline/></IconButton>
                <IconButton><IoPencilOutline/></IconButton>
                <IconButton><IoTrashOutline/></IconButton>
            </div>
        </CardContent>
    )
}

