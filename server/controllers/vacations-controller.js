const vacationLogic = require("../bll/vacation-logic");
const express = require("express");
const router = express.Router();

//get all vacations
router.get("/", async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacations();
        response.json(vacations);
    } catch (err) {
        response.status(500).json(err.message)
    }
});


// get one  vacation
router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = await vacationLogic.getOneVacation(id);
        response.json(vacation);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

// add vacation
router.post("/", async (request, response) => {
    try {
        const vacation = request.body;
        const addedVacation = await vacationLogic.addVacation(vacation);
        response.status(201).json(addedVacation);
    } catch (err) {
        response.status(500).json(err.message)
    }
});

//update full vacation
router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = request.body;
        vacation.vacationID = id;
        const addedVacation = await vacationLogic.updateFullVacation(vacation);
        response.json(addedVacation);
    } catch (err) {
        response.status(500).json(err.message)
    }
});


//update partial vacation
router.patch("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = request.body;
        vacation.vacationID = id;
        const updatedVacation = await vacationLogic.updatePartialVacaion(vacation);
        response.json(updatedVacation);
    } catch (err) {
        response.status(500).json(err.message)
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await vacationLogic.deleteVacation(id);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).json(err.message)
    }
});



module.exports = router;