const Joi = require("joi")

class User {
    constructor(userID, typeOfUser, userFirstName, userSecondName, userName, userPassword) {
        this.userID = userID;
        this.typeOfUser = typeOfUser;
        this.userFirstName = userFirstName;
        this.userSecondName = userSecondName;
        this.userName = userName;
        this.userPassword = userPassword;
    }


    //Validate the  new user
    static validate(userToValildate) {

        const validationSchema = {
            userFirstName: Joi.string().required(),
            userSecondName: Joi.string().required(),
            userName: Joi.string().required().min(4).max(20),
            userPassword: Joi.string().required().min(4).max(20),
        };

        const error = Joi.validate(
            userToValildate, validationSchema, { abortEarly: false }).error;

        if (error) {
            return error.details.map(err => err.message)
        }

        return null;
    }

}


module.exports = User;