/**
 * @brief utility function for copying items to clipboard
 *
 * @param {string} formattedString questions and answers from the flashcard converted to type string
 */
export function clipboardWriter(formattedString: string): void {
    navigator.clipboard.writeText(formattedString)
        .then((): void => {
            console.log('Text copied to clipboard!', formattedString)
        })
        .catch((error): void => {
            console.log('Failed to copy text to clipboard', error)
        })
}

