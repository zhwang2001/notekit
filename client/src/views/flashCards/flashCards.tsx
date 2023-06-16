import React, { JSX } from 'react';
import { Card, CardContent, Divider, IconButton, Typography } from "@mui/material";
import { IoCopyOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

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
  const { response, handlePageChange, setResponse } = props;

  return (
    <CardContent sx={{ height: '100vh', padding: '10%' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => {
            handlePageChange("backward");
            setResponse([])
          }}>
            <IoIosArrowBack size={35} />
          </IconButton>
        </div>
        <Typography variant="h2" color="text.primary" sx={{ margin: '30px 0px 30px 10px', width: '100%' }}>
          Quiz
        </Typography>
      </div>
      {response.map((data: string[], index: number) => (
        <FlashCard key={index} data={data} />
      ))}
    </CardContent>
  );
};


export default FlashCards
/**
 * @constructor
 *
 * @brief A functional UI component that returns an individual flashcard
 *
 * @param {object} props the props object
 * @returns {JSX.Element} the question and answer to the flashcard as well as buttons to interact with the flashcard
 */
function FlashCard(props: { data: Array<string> }): JSX.Element {
  return (
    <CardContent sx={{ width: '30vw', display: 'flex', flexFlow: 'row nowrap' }}>
      <Card sx={{
        width: '100%',
        backgroundColor: '#f2f2f2',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant={"h6"} color={"text.primary"} sx={{ fontWeight: '600' }}>
            {props.data[0]}
          </Typography>
        </div>
        <Divider sx={{ margin: '10px 0px 10px 0px' }} light />
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
        <IconButton><IoCopyOutline /></IconButton>
        <IconButton><IoPencilOutline /></IconButton>
        <IconButton><IoTrashOutline /></IconButton>
      </div>
    </CardContent>
  )
}

