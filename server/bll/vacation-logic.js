const dal = require("../dal/dal");


//get all vacations
async function getAllVacations() {
    const sql = `select * from vacations`;
    const vacations = await dal.execute(sql);
    return vacations;
};

// get one vacation
async function getOneVacation(id) {
    const sql = `select * from vacations where vacationID=${id}`;
    const vacation = await dal.execute(sql);
    return vacation[0];
}

//add new vacation
async function addVacation(vacation) {
    const sql = `insert into vacations(description,destination,nameOfIMG,dateFrom,dateTo,price)
    values(
        '${vacation.description}',
        '${vacation.destination}',
        '${vacation.nameOfIMG}',
        '${vacation.dateFrom}',
        '${vacation.dateTo}',
        '${vacation.price}'
    )`;
    const info = await dal.execute(sql);
    vacation.vacationID = info.insertId;
    return vacation;
};


//update full vacation
async function updateFullVacation(vacation) {
    const sql = `update vacations
     set description='${vacation.description}',
     destination='${vacation.destination}',
     nameOfIMG='${vacation.nameOfIMG}',
     dateFrom='${vacation.dateFrom}',
     dateTo='${vacation.dateTo}',
     price=${vacation.price} where vacationID=${vacation.vacationID}`;
    await dal.execute(sql);
    return vacation;
}


async function updatePartialVacaion(vacation) {
    const sql = `update vacations
     set description='${vacation.description}',
     destination='${vacation.destination}',
     nameOfIMG='${vacation.nameOfIMG}',
     dateFrom='${vacation.dateFrom}',
     dateTo='${vacation.dateTo}',
     price=${vacation.price} where vacationID=${vacation.vacationID}`;
    await dal.execute(sql);
    return vacation;
};

async function deleteVacation(id) {
    const sql = `delete from vacations where vacations.vacationID=${id}`;
    await dal.execute(sql);
}



module.exports = {
    getAllVacations,
    getOneVacation,
    addVacation,
    updateFullVacation,
    updatePartialVacaion,
    deleteVacation,

}