const sqlite3 = require('sqlite3').verbose();

class Db {
    constructor(file) {
        this.db = new sqlite3.Database(file);
        this.createTable()
        this.createTable2()
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id integer PRIMARY KEY, 
                name text, 
                email text UNIQUE, 
                user_pass text,
                balance integer DEFAULT 10
                )`
        return this.db.run(sql);
    }

    removeNum(number, callback){
         return this.db.run(
            `DELETE FROM numbers WHERE tzid=? AND user_id=?`,
            number,function(err,row){
                if(err) return err
                callback(err, this.changes)
            })
    }

    createTable2() {
        const sql1 = `
            CREATE TABLE IF NOT EXISTS numbers (
                id integer PRIMARY KEY,
                tzid integer, 
                user_id integer,
                used integer DEFAULT 0
                )`
        return this.db.run(sql1);
    }

    selectNumberById(owner_id, callback) {
        return this.db.all(
            `SELECT * FROM numbers WHERE user_id = ?`, [owner_id], function(err,row){
                callback(err,row)
            })
    }

    selectByEmail(email, callback) {
        return this.db.get(
            `SELECT * FROM users WHERE email = ?`,
            [email],function(err,row){
                callback(err,row)
        })
    }

    selectByTzid(tzid, user_id, callback) {
        let sql = 'SELECT * FROM numbers WHERE tzid = '+tzid+' AND user_id ='+user_id
        return this.db.get(sql,[], (err, row) => {
            console.log(row)
            callback(err, row)
        })
    }
    
    subtractBalance(user_id, tzid, sum, callback){
        const sql1 = 'UPDATE users SET balance='+sum+' WHERE id='+user_id
        const sql2 = 'UPDATE numbers SET used=1 WHERE user_id = '+user_id+' AND tzid='+tzid
        return this.db.run(sql1, (err1) => {
            if (err1) throw err1
            this.db.run(sql2, err => {
                if(err) throw err
                callback(err, this.changes)   
            })
        });
    }


    selectAll(callback) {
        return this.db.all(`SELECT * FROM users`, function(err,rows){
            callback(err,rows)
        })
    }

     insertNumber(number, callback) {
        return  this.db.run('INSERT INTO numbers (tzid, user_id) VALUES (?,?)', number, (err, row) => {
                if (err) {
                  return console.log(err.message);
                }
                callback(row)
              })
    }

    insert(user, callback) {
        return this.db.run(
            'INSERT INTO users (email,user_pass,balance) VALUES (?,?,?)',
            user, (err, row) => {
                console.log(row)
                callback(err, user)
            })
    }
}

module.exports = Db