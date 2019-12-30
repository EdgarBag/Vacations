const dal = require("../dal/dal");

async function sumOffollowersPerVacation() {
    const sql = `select id, dataoffollowers.vacationID,vacations.destination,COUNT(userID) as countOfFollowers
    from dataoffollowers
    join vacations on vacations.vacationID=dataoffollowers.vacationID GROUP BY vacationID`;
    const followersPerVacation = await dal.execute(sql);
    return followersPerVacation;
}


async function addNewFollow(follow) {
    const sql = `insert into dataoffollowers(userID,vacationID)  values(${follow.userID},${follow.vacationID})`;
    const info = await dal.execute(sql);
    follow.id = info.insertId;
    return follow;

}

async function deleteFollow(id) {
    const sql = `delete from dataoffollowers where id=${id}`;
    await dal.execute(sql);
}

module.exports = {
    
    sumOffollowersPerVacation,
    addNewFollow,
    deleteFollow,
}