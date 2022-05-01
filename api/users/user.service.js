const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into users(firstName, lastName, gender, email, password, number, postCode, address) 
            values(?,?,?,?,?,?,?,?)`,
            [
                data.firstName,
                data.lastName,
                data.gender,
                data.email,
                data.password,
                data.number,
                data.postCode,
                data.address
            ],
            (error, results, fields) => {
                if (error) {
                  callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getUsers: callBack => {
        pool.query(
          `select id,firstName,lastName,gender,email,number, postCode, address from users`,
          [],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results);
          }
        );
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
          `select id,firstName,lastName,gender,email,number, postCode, address from users where id = ?`,
          [id],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
    },
    getUserByUserEmail: (email, callBack) => {
        pool.query(
          `select * from users  where email = ?`,
          [email],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
    },
    updateUser: (data, callBack) => {
        pool.query(
          `update users set firstName=?, lastName=?, gender=?, email=?, password=?, number=? where id = ?`,
          [
            data.firstName,
            data.lastName,
            data.gender,
            data.email,
            data.password,
            data.number,
            data.id,
            data.postCode,
            data.address
          ],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results);
          }
        );
    },
    deleteUser: (id, callBack) => {
        pool.query(
          `delete from users where id in (${id})`,
          [id],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results);
          }
        );
    }
}