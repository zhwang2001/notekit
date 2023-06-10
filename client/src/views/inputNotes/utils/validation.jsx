/**
 * @brief this function evaluates whether the input is valid
 *
 * @param typedCharacters this parameter contains the user's input
 * @returns {boolean} evaluates whether RegExp has been satisfied
 */
export function inputValidation({typedCharacters}) {
    const RegExp = /^(?=.*\d)([1-9]\d{0,3}|10000)$/;
    console.log(RegExp.test(typedCharacters));
    return RegExp.test(typedCharacters);
}
