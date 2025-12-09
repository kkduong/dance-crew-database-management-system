/*
    ECLIPSE Crew Management System
    Group 79 - Jenna Rivera and Kaelee Duong
    Database Connector for CS340 Final Project

    Citations:
    Date: 11/5/2025
    - Copied from Activity 2: Connect webapp to database
*/

let mysql = require('mysql2')

const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : 'classmysql.engr.oregonstate.edu',
    user              : 'cs340_duongkae',
    password          : '6989',
    database          : 'cs340_duongkae'
}).promise(); 

module.exports = pool;