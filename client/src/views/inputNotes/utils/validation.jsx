export function inputValidation({typedCharacters}) {
    const RegExp = /^(?=.*\d)([1-9]\d{0,3}|10000)$/;
    console.log(RegExp.test(typedCharacters));
    return RegExp.test(typedCharacters);
}
