const mysql = require('mysql2');
require('dotenv').config();

var db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

exports.connectToDatabase = function() {
    db.connect(function(err) {
        if (err) throw err;
        console.log("Connected to database!");
    });
}

exports.createDB = function(name) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query("USE " + name, function(err, result) {
        if (err) {
            db.query(`CREATE DATABASE ${name}`, function(err, result) {
                if (err) throw err;
                console.log("Database created");
            });
        } else {
            console.log("Database already exists");
        }
    });
}

// if you just want connect to the database
// connectToDatabase();

// if you want to create a database and connect to it
// createDB(process.env.DB_NAME);

exports.insertDB = function(name, dataname, data, callback) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query(`INSERT INTO ${name} (${dataname}) VALUES (${data})`, function(err, result) {
        if (err)
            return callback("KO");
        else
            return callback("OK");
    });
}

exports.updateDB = function(name, column, data, whereName, whereData, callback) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query(`UPDATE ${name} SET ${column}='${data}' WHERE ${whereName}='${whereData}' `, function(err, result) {
        if (err)
            return callback("KO");
        else
            return callback("OK");
    });
}

exports.selectDB = function(name, whereName, whereData, callback) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query(`SELECT * FROM  ${name} WHERE ${whereName}='${whereData}'`, function(err, result) {
        if (err) {
            return callback("KO");
        }
        return callback(result);
    });
}

exports.selectDBAll = function(name, callback) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query(`SELECT * FROM  ${name}`, function(err, result) {
        if (err) {
            return callback("KO");
        }
        return callback(result);
    });
}

exports.selectLastDB = function(name, column, callback) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query(`SELECT * FROM ${name} ORDER BY ${column} DESC LIMIT 1`, function(err, result) {
        if (err)
            return callback("KO");
        else
            return callback(result);
    });
}

exports.deleteDB = function(name, whereName, whereData, callback) {
    if (name == null) {
        console.log("Please enter a database name");
        return;
    } else if (name == "") {
        console.log("Please enter a database name");
        return;
    }
    db.query(`DELETE FROM ${name} WHERE ${whereName}='${whereData}'`, function(err, result) {
        if (err)
            return callback("KO");
        else
            return callback("OK");
    });
}