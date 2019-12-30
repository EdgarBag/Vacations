const usersLogic = require("../bll/users-logic");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

//get all users
router.get("/", async (request, response) => {
    try {
        const users = await usersLogic.getAllUsers();
        response.json(users);
    } catch (err) {
        response.status(500).json(err.message)
    }
});


//get one user
router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = await usersLogic.getOneUser(id);
        response.json(user);
    } catch (err) {
        response.status(500).json(err.message);
    }
});


//add user
router.post("/", async (request, response) => {
    try {

        //Validate the user to add

        const userToAdd = request.body;
        const errorDetails = User.validate(userToAdd);
        if (errorDetails) {
            response.status(400).json(errorDetails);
            return;
        }
        const ifUserNameExist = await usersLogic.ifNewUserNameExistInDB(userToAdd.userName);
        if (ifUserNameExist) {
            response.json("User Name already exist in the system.\nPlease select a different one!");
            return;
        }

        const addedUser = await usersLogic.addUser(userToAdd);
        response.status(201).json(addedUser);
    } catch (err) {
        response.status(500).json(err.message)
    }
});


router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await usersLogic.deleteUser(id);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).json(err.message)
    }
})


module.exports = router;