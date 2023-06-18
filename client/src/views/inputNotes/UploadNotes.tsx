import React, { JSX, useRef, useState } from 'react'
import * as pdfjslib from 'pdfjs-dist'
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import { TextContent } from "pdfjs-dist/types/web/text_layer_builder";
import { Button, FormHelperText, IconButton, Tooltip, Typography } from "@mui/material";
import { FiUpload } from 'react-icons/fi'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { RxTriangleRight } from 'react-icons/rx'
import { DocumentInitParameters, TypedArray } from "pdfjs-dist/types/src/display/api";
import { useDispatch } from 'react-redux';
import { setAlert } from '../../reducers/alertsSlice';

type pageChangeFunction = (direction: string) => void
type submitPromptFunction = (textInput: string) => Promise<void>


/**
 * @constructor
 *
 * @brief A functional UI component that allows the user to upload pdfs for processing
 *
 * @props {object} the props object
 * @returns {JSX.Element} an upload button that only allows pdfs to be uploaded
 */
export default function UploadPdf(props: {
    handlePageChange: pageChangeFunction,
    submitPrompt: submitPromptFunction
}): JSX.Element {

    const dispatch = useDispatch();
    //define state management for managing upload error state
    const [uploadError, setUploadError] = useState<boolean>(false)
    //define state management for managing helper text message
    const [helperMsg, setHelperMsg] = useState<string>('')
    //define state management for managing showSlider state
    const [showSlider, setShowSlider] = useState<boolean>(false)
    //define state management for managing pages selected
    type firstPage = 1
    type finalPage = number
    const [pageRange, setPageRange] = useState<[firstPage, finalPage]>([1, 1]);
    //define state management for managing the number of pages within the pdf
    const [numPages, setNumPages] = useState<number>(0)
    //define state management for storing the processed pdf
    const [doc, setDoc] = useState<PDFDocumentProxy | undefined>(undefined)

    /**
     * @brief used for aria label
     * @param {number} value
     */
    const pageNumber = (value: number): string => {
        return `page ${value}`;
    }
    /**
     *
     * @brief event handler for recording values from slider
     * @param {Event} event parameter contains the event object
     * @param {[firstPage, finalPage]} newValue parameter contains the selected pages
     */
    const handleChange = (event: Event, newValue: number | number[]): void => {
        event.type;
        setPageRange(newValue as [firstPage, finalPage]);
    };

    /**
     * @brief This function initializes pdf.js and prepares the pdf document using base64 string
     *
     * @details How this function works
     * - Initialize pdf.js global worker options
     * - Process the pdf document using dataUrl (base64 string)
     * - Provide the document, page range, and number of pages of pdf document globally
     * - Allow the user to choose which pages to process using the slider
     * @param {string} dataUrl base64 string of pdf file
     * @see setDoc stores the converted pdf document
     * @see setNumPages stores the number of pages of the pdf
     * @see setPageRange stores an array containing the range of pages that'll be used k
     * @see setShowSlider boolean for showing the slider
     */
    const processDocument = async (dataUrl: string | ArrayBuffer | URL | TypedArray | DocumentInitParameters): Promise<void> => {
        //initialize pdf.js
        pdfjslib.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js'
        //await processed document data
        const doc = await pdfjslib.getDocument(dataUrl).promise
        setDoc(doc)
        setNumPages(doc.numPages)
        setPageRange([1, doc.numPages])
        setShowSlider(true)
    }

    /**
     * @brief event handler for processing the uploaded pdf file
     *
     * @param {React.ChangeEvent<HTMLInputElement | null>} e parameter contains the event object
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | null>): void => {
        const file: File | undefined = e.target.files?.[0];
        if (file) {
            if (file.type === "application/pdf") {
                setHelperMsg(`* Successfully Uploaded ${file.name}`)
                setUploadError(false)
                dispatch(setAlert(["Success", 'success', `Successfully uploaded ${file.name}`]))
                setTimeout(() => dispatch(setAlert([])), 5000);
                console.log('Uploaded file', file);
                //initialize fileReader to convert PDF file to base64 string
                const reader: FileReader = new FileReader();
                reader.onload = (): void => {
                    if (reader.result) {
                        const dataUrl: string | ArrayBuffer | URL | DocumentInitParameters = reader.result;
                        //prepares the PDF for processing using base64 string
                        processDocument(dataUrl).catch(error => console.log('an error occurred: ', error))
                    }
                }
                reader.readAsDataURL(file);
            } else {
                setHelperMsg(`* Invalid File Type {${file.type}}. Only PDF files are allowed`)
                setShowSlider(false)
                setUploadError(true)
                dispatch(setAlert(['Error', 'error', 'Invalid File Type. Only PDF files are allowed']))
                setTimeout(() => dispatch(setAlert([])), 5000);
            }

        }
    }

    //Logic for upload button
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    /**
     * @brief function to access underlying functionality of input
     */
    const handleFileUpload = (): void => {
        fileInputRef.current?.click()
    }

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div>

                <input
                    type={"file"}
                    accept={".pdf"}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                    <FormHelperText sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '300px'
                    }}
                        error={uploadError}>
                        <Button
                            sx={{
                                "&.Mui-disabled": { backgroundColor: 'lightGrey', color: 'white' },
                                backgroundColor: '#253859',
                                width: '300px',
                                padding: '0px',
                                marginTop: '20px',
                                '&:hover': { backgroundColor: 'black', color: 'aqua' },
                            }}
                            onClick={handleFileUpload}>
                            <Typography
                                variant={"h6"}
                                color={"text.primary"}
                                sx={{
                                    fontSize: '20px',
                                    color: 'aqua',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: '5px 0px 5px 0px',
                                }}>
                                <FiUpload style={{ padding: '10px 10px 15px 10px' }} />
                                Upload PDF Here
                            </Typography>
                        </Button>
                        <div style={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {helperMsg}
                        </div>
                    </FormHelperText>
                    {showSlider && doc
                        ? <Tooltip title={"Submit the PDF"} placement={'right'} arrow>
                            {/*convert pdf to text*/}
                            <Button onClick={() => {
                                pdfToText(doc, pageRange, props.submitPrompt);
                                props.handlePageChange('forward')
                            }} sx={{ padding: '10px', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" color="text.secondary" sx={{ fontSize: '15px', padding: '5px 0px 0px 5px' }}>
                                    Submit PDF
                                </Typography>
                                <RxTriangleRight size={35} style={{ color: '#253859' }} />
                            </Button>
                        </Tooltip>
                        : null}
                </div>
                {showSlider
                    ? <Box sx={{ width: '100%', color: 'black' }}>
                        <Slider
                            getAriaLabel={() => 'Page Range'}
                            size={"small"}
                            value={pageRange}
                            min={1}
                            max={numPages}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={pageNumber}
                        />
                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '15px' }}>
                            Choose a range of pages to submit
                        </Typography>
                    </Box>
                    : null}
            </div>
        </div>
    )
}

type firstPage = 1
type finalPage = number
/**
 * @brief this function contains the logic to extract the content of a select number of pages within the pdf
 *
 * @param {PDFDocumentProxy} doc parameter that contains the pdf processed by pdf.js
 * @param {[1, finalPage]} pageRange parameter that contains the number of pages in the pdf
 * @param {Function} submitPrompt parameter contains the logic to submit prompt to gpt
 * @returns {TextContent[] | undefined} an array containing the data within each page
 */
const pdfToText = (doc: PDFDocumentProxy, pageRange: [firstPage, finalPage], submitPrompt: submitPromptFunction): void => {

    interface contentObject {
        items: pageInfoObject[]
        styles: object
    }

    interface pageInfoObject {
        dir: string,
        fontName: string,
        hasE0L: boolean,
        height: number,
        str: string,
        transform: number[],
        width: number,
    }

    /**
     * @brief A function that returns the pages within the pdf
     *
     * @param {PDFDocumentProxy} doc parameter that contains the pdf processed by pdf.js
     * @param {[1, finalPage]} pageRange parameter that contains the number of pages in the pdf
     */
    async function getPages(doc: PDFDocumentProxy, pageRange: [firstPage, finalPage]): Promise<contentObject[] | undefined> {
        try {
            const firstPage = pageRange[0];
            const totalPages = pageRange[1];
            //store the data collected from pdf
            const allContent: contentObject[] = [];
            //iterate through the pages of the pdf retrieving content of the page
            for (let pageNumber = firstPage; pageNumber <= totalPages; pageNumber++) {
                const page: PDFPageProxy = await doc.getPage(pageNumber);
                const content: TextContent = await page.getTextContent();
                console.log('Page', pageNumber, 'Content:', content);
                allContent.push(content);
            }
            console.log(allContent)
            return allContent
        } catch (error) {
            console.log('an error occurred', error)
        }
    }

    /**
     * @brief A function returns the content of each page within the pdf
     *
     * @param {PDFDocumentProxy} doc parameter that contains the pdf processed by pdf.js
     * @param {[1, finalPage]} pageRange parameter that contains the number of pages in the pdf
     * @param {Function} submitPrompt parameter that contains the logic ne
     * @returns {Promise<void>} a promise containing the properties of each line
     */
    async function getLines(doc: PDFDocumentProxy, pageRange: [firstPage, finalPage], submitPrompt: submitPromptFunction): Promise<Promise<void>[]> {
        const content: contentObject[] | undefined = await getPages(doc, pageRange)

        if (!content) {
            return [];
        }
        //map out the pages
        return content.map(async (pageInfo: contentObject, index: number): Promise<void> => {
            try {
                let contentToSubmit = ''
                contentToSubmit += `\n\n\n-----------------------------Page ${index + 1}--------------------------------\n\n\n`
                await Promise.all(
                    //map out the lines
                    pageInfo.items.map((lineInfo: pageInfoObject): Promise<void> => {
                        contentToSubmit += lineInfo.str
                        return Promise.resolve();
                    }))
                console.log(contentToSubmit)
                //submit prompt to gpt
                submitPrompt(contentToSubmit)
                    .then(() => console.log('Successfully created quiz!'))
                    .catch((error: unknown) => console.log('An error has occurred: ', error))
            } catch (error) {
                console.log('An error occurred: ', error)
                return Promise.reject(error);
            }
        })
    }

    getLines(doc, pageRange, submitPrompt)
        .then((response): void => {
            console.log(response)
        })
        .catch((error: unknown) => console.log(error))
}