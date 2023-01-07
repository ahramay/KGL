const handleError = (error) => {
    let errors = {};
    if (error.code === 11000) {
        const erObj = (error.keyValue);
        for (const key in erObj) {
            errors[key] = `This ${key} '${erObj[key]}' is already in use.`
        }
        // errors.email = 'Email is already in use.';
        return errors;
    } else if (error.message.includes('validation failed')) {
        for (let key in error.errors) {
            errors[key] = error.errors[key].properties.message;
        }
    } else if (error.message == 'Invalid') {
        errors.password = 'Incorrect credentials ';
    } else if (error.message == 'Not found') {
        errors.email = 'Account does\'t exists';
    } else {
        errors.message = "Something went wrong.";
    }

    return errors;
};

module.exports = handleError;