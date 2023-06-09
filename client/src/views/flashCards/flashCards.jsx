import {Card, CardContent, Divider, IconButton, Typography} from "@mui/material";
import {IoCopyOutline, IoPencilOutline, IoTrashOutline} from "react-icons/io5";

const data =
    [
        ["What is the current state of the 10-year Treasury yields?", "They are up 10 basis points to 3.7%"],
        ["What is unusual about the current Eurozone recession?", "It is paired with a record-low unemployment rate of 6.5%."],
        ["What did the Federal Reserve consider after reports of continued labor market tightness and stubborn inflation?", "Further rate hikes."],
        ["What is the current likelihood that the Fed will leave rates unchanged next week?", "70%"],
        ["What happened over the weekend that resolved the debt ceiling impasse?", "President Biden signed the bipartisan bill."],
        ["How did energy markets respond to Saudi Arabia's announcement?", "Answer: Oil prices rose less than 1%."],
        ["What announcement did Saudi Arabia make regarding oil production?", "Answer: It will cut oil production by a million barrels per day in July."],
        ["What is the current state of major equity indices and 10-year Treasury yields?", "Answer: Major equity indices are up 1%-2% over the last week, while 10-year Treasury yields are up 10 basis points to 3.7%."]
    ]
export default function FlashCards() {
    return (
        <CardContent sx={{height: '100vh', padding: '10%'}}>
            <Typography variant={"h2"} color={"text.primary"} sx={{margin: '30px 0px 30px 10px', width: '100%'}}>
                Oil Economics Quiz
            </Typography>
            {data.map((card, index) => {
                return (<FlashCard card={card}/>)
            })}
        </CardContent>
    )
}

function FlashCard({card}) {
    return (
        <CardContent sx={{width: '30vw', display: 'flex', flexFlow: 'row nowrap'}}>
            <Card sx={{
                width: '100%',
                backgroundColor: '#f2f2f2',
                padding: '20px',
            }}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Typography variant={"h6"} color={"text.primary"} sx={{fontWeight: '600'}}>
                        {card[0]}
                    </Typography>
                </div>
                <Divider sx={{margin: '10px 0px 10px 0px'}} light/>
                <Typography variant={"h6"} color={"text.secondary"}>
                    {card[1]}
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

