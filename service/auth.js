const sessionIdToUserMap = new Map();
const jwt = require("jsonwebtoken");
const secret = "Deepak$4444$";

function setUser(user){
    const payload = {
        ...user,
    };
    return jwt.sign(payload, secret);
}

function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser,
}










// function setUser(id, user){
//     sessionIdToUserMap.set(id, user);
// }

// function getUser(id){
//     return sessionIdToUserMap.get(id);
// }

// module.exports = {
//     setUser,
//     getUser,
// }