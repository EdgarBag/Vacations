const dal = require("../dal/dal");

//get all Users
async function getAllUsers() {
    const sql = ` select * from users`;
    const users = await dal.execute(sql);
    return users;
}


//get one user
async function getOneUser(id) {
    const sql = `select * from users where userID=${id}`;
    const user = await dal.execute(sql);
    return user[0];
}

//add user
async function addUser(user) {
    const sql = `insert into users (userFirstName,userSecondName,userName,userPassword)
        values
    
   ('${user.userFirstName}',
    '${user.userSecondName}',
    '${user.userName}',
    '${user.userPassword}')`;

    const info = await dal.execute(sql);
    user.userID = info.insertId;
    return user;
}
// delete user
async function deleteUser(id) {
    const sql = `delete from users where userID=${id}`;
    await dal.execute(sql);
}


async function ifNewUserNameExistInDB(userName) {
    const sql = `select userID from users where userName='${userName}'`;
    const userNameAfterCheck = await dal.execute(sql);

    if (userNameAfterCheck.length === 0) {
        return false;
    }
    return true;
}

module.exports = {
    getAllUsers,
    getOneUser,
    addUser,
    deleteUser,
    ifNewUserNameExistInDB
}
