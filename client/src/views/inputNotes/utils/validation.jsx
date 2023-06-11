/**
 * @brief this function evaluates whether the input is between 500 and 10000 characters
 *
 * @param {number} typedCharacters this parameter contains the user's input
 * @returns {boolean} evaluates whether RegExp has been satisfied
 */
export function inputValidation({typedCharacters}) {
    const RegExp = /^(?=.*\d)([5-9]\d{2}|[1-9]\d{3}|10000)$/;
    console.log(RegExp.test(String(typedCharacters)));
    return RegExp.test(String(typedCharacters));
}
