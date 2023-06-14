import React, {JSX, useRef} from 'react'
import * as pdfjslib from 'pdfjs-dist'
import {TextContent} from "pdfjs-dist/types/web/text_layer_builder";
import {Button, Typography} from "@mui/material";
import {FiUpload} from 'react-icons/fi'
import {PDFDocumentProxy, PDFPageProxy} from "pdfjs-dist";

/**
 *
 * @constructor
 *
 * @brief A functional UI component that allows the user to upload pdfs for processing
 *
 * @returns {JSX.Element} an upload button that only allows pdfs to be uploaded
 */
export default function UploadPdf(): JSX.Element {

    /**
     * @brief event handler for processing the uploaded pdf file
     * @param {any} e event parameter
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | null>): void => {
        const file: File | undefined = e.target.files?.[0];
        if (file){
            if (file.type === "application/pdf"){
                console.log('Uploaded file', file);
                //initialize fileReader to convert PDF file to data URL
                const reader = new FileReader();
                reader.onload = (): void => {
                    const dataUrl: string | ArrayBuffer | null = reader.result;
                    console.log('Data URL:', dataUrl);
                    //convert pdf to text
                    pdfToText(dataUrl);
                };
                reader.readAsDataURL(file);

            } else{
                console.log('Invalid File Type. Only PDF files are allowed')
            }

        }
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    /**
     * @brief function to access underlying functionality of input
     */
    const handleFileUpload = (): void => {
        fileInputRef.current?.click()
    }
    return(
        <>
            <input
                type={"file"}
                accept={".pdf"}
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <Button
                sx={{
                    "&.Mui-disabled": {backgroundColor: 'lightGrey', color: 'white'},
                    backgroundColor: '#253859',
                    padding: '10px',
                    marginTop: '20px',
                    '&:hover': {backgroundColor: 'black', color: 'aqua'},
                }}
                onClick={handleFileUpload}
            >
                <Typography variant={"h6"}
                            color={"text.primary"}
                            sx={{fontSize: '20px', color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0px 10px 0px 10px'}}
                >
                    <FiUpload style={{paddingRight: '10px'}} />
                    Upload PDF Here
                </Typography>
            </Button>
        </>
    )
}


/**
 * @brief this function contains the logic to extract the content of a select number of pages within the pdf
 *
 * @param {string} dataUrl PDF that's been converted to base64 string
 * @returns {TextContent[] | undefined} an array containing the data within each page
 */
const pdfToText = (dataUrl: string): void => {
    pdfjslib.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js'

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
     * @param {string} src the dataUrl of the PDF
     */
    async function getPages(src: string): Promise<contentObject[] | undefined> {
        try {
            //load pdf document data
            const doc: PDFDocumentProxy = await pdfjslib.getDocument(src).promise
            //obtain the number of pages from the document
            const numPages: number = doc.numPages;

            //store the data collected from pdf
            const allContent: contentObject[] = []
            //iterate through the pages of the pdf retrieving content of the page
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                const page: PDFPageProxy = await doc.getPage(pageNumber)
                const content: TextContent = await page.getTextContent()
                console.log('Page', pageNumber, 'Content:', content);
                allContent.push(content)
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
     * @param {string} src the dataUrl of the PDF
     * @returns {Promise<void>} a promise containing the properties of each line
     */
    async function getLines(src: string): Promise<Promise<void>[]> {
        const content: contentObject[] | undefined = await getPages(src)

        if (!content) {
            return [];
        }
        //map out the pages
        return content.map(async (pageInfo: contentObject, index: number): Promise<void> => {
            console.log(`\n\n\n-----------------------------Page ${index + 1}--------------------------------\n\n\n`)
            try {
                await Promise.all(
                    //map out the lines
                    pageInfo.items.map((lineInfo: pageInfoObject): Promise<void> => {
                        console.log(lineInfo.str);
                        return Promise.resolve();
                    }))
            } catch (error) {
                console.log('An error occurred: ', error)
                return Promise.reject(error);
            }
        })
    }

    getLines(dataUrl)
        .then((response): void => {
            console.log(response)
        })
        .catch((error: unknown) => console.log(error))
}
