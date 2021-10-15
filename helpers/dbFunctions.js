const mySQL = require('mysql');
const botSettings = require('../botsettings.json');
// mySQL Connection parameters
const sqlConnection = mySQL.createConnection({
    host: botSettings.host,
    user: botSettings.user,
    password: botSettings.password,
    database: botSettings.database
});

// Initiate sql connection
sqlConnection.connect(err => {
    if (err) {
        console.log(`Error connecting: ${err.stack}`);
        return;
    }
    //console.log(`Connected as ID: ${sqlConnection.threadID}`);
});

// Get user summoner info from DB
async function getUserInfo(userID) {
    // Return a promise of the retrieved information
    return new Promise((resolve, reject) => {
        sqlConnection.query(`SELECT userSummoner, summonerRegion FROM discordsummoners WHERE userID=?`, userID, (err, result, fields) => {
            if (err) {
                reject(console.log(err));
            }
            else if (result.length > 0) {
                resolve(result);
            }
            else {
                reject(result);
            }
        })

    });
}
// Insert Discord User's summoner info into DB
function insertUserSummonerInfo(userID, userSummoner, summonerRegion) {
    return new Promise((resolve, reject) => {
        sqlConnection.query(`INSERT INTO discordsummoners(userID, userSummoner, summonerRegion) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE userSummoner=?, summonerRegion=VALUES(summonerRegion)`, [userID, userSummoner, summonerRegion, userSummoner], (err, result, fields) => {
            if (err) reject(console.log(err));
            resolve();
        });
    });

}

module.exports = {
    getUserInfo,
    insertUserSummonerInfo
}
