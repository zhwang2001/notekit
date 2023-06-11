/**
 * @brief this function evaluates whether the input is valid
 *
 * @param {number} typedCharacters this parameter contains the length of the user inpute
 * @returns {boolean} evaluates whether RegExp has been satisfied
 */
export function inputValidation(typedCharacters: number) {
    const RegExp = /^(?=.*\d)([1-9]\d{0,3}|10000)$/;
    console.log(RegExp.test(String(typedCharacters)));
    return RegExp.test(String(typedCharacters));
}
