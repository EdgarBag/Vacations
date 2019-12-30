const express = require("express");
const router = express.Router();
const followersLogic = require("../bll/followers-logic");


router.get("/", async (requets, response) => {
    try {
        const followersPerVacation = await followersLogic.sumOffollowersPerVacation();
        response.json(followersPerVacation);
    } catch (err) {
        response.status(500).json(err.message);
    }
});



router.post("/", async (request, response) => {
    try {
        const followToAdd = request.body;
        const addedFollow = await followersLogic.addNewFollow(followToAdd);
        response.status(201).json(addedFollow);
    } catch (err) {
        response.status(500).json(err.message)
    }
})


router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await followersLogic.deleteFollow(id);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).json(err.message);
    }
})
module.exports = router;