

// Primera letra en mayuscula
function FirstCapitalLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
}

//String en minuscula
function LowercaseString(value){
    return value.toLowerCase()
}

module.exports = {
    FirstCapitalLetter,
    LowercaseString

}