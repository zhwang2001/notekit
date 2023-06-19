import React from 'react';
import { CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import { IoCopy } from "react-icons/io5";
import { IoIosArrowBack, IoLogoTwitter } from "react-icons/io";
import { clipboardWriter } from "./utils/functionalUtils.tsx";
import { FlashCard } from "./components/flashCard.tsx";
import {useSnackbar, VariantType} from "notistack";

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
export const FlashCards: React.FC<FlashCardsProps> = (props: FlashCardsProps): React.ReactElement => {

    const { handlePageChange, response, setResponse } = props;
    const { enqueueSnackbar } = useSnackbar();

    /**
     * @brief function used for formatting a nested array into a string
     *
     * @param {string[][]} flashcard
     * @returns {string} questions and answers formatted to be copied
     */
    const FormatFlashcardArray = (flashcard: string[][]): string => {
        return flashcard.map(([question, answer]): string => `Q: ${question} | A: ${answer}`).join('\n\n')
    }

    /**
     * @constructor
     *
     * @brief function used to copy the entire quiz to your clipboard
     *
     * @see formatFlashCardArray process array into string
     * @see clipboardWriter copy formatted string into clipboard
     */
    function CopyEntireQuiz(): void {
        const flashcardString: string = FormatFlashcardArray(response)
        clipboardWriter(flashcardString)
        const variant: VariantType = 'success'
        enqueueSnackbar('Quiz successfully copied!', {variant})
    }

    /**
     * @brief function for copying link to clipboard
     *
     * @see clipboardWriter copy formatted string into clipboard
     */
    function CopyShareableLink(): void {
        const websiteLink: string = window.location.href;
        clipboardWriter(websiteLink)
        const variant: VariantType = 'success'
        enqueueSnackbar('Quiz link successfully copied!', {variant})
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
                    <IconButton onClick={(): void => {
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
                        <IconButton onClick={CopyEntireQuiz}>
                            <IoCopy/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Share this Quiz"}
                             arrow>
                        <IconButton onClick={CopyShareableLink}>
                            <IoLogoTwitter/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            {response.map((data: string[], index: number) => (
                <FlashCard
                    data={data}
                    index={index}
                    response={response}
                    setResponse={setResponse}
                />
            ))}
        </CardContent>
    );
};

export default FlashCards
