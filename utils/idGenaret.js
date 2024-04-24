// Generate a random number with a specified number of digits
function generateRandomNumber(digits) {
    // Calculate the minimum and maximum values for the specified number of digits
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    
    // Generate a random number within the specified range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { generateRandomNumber }