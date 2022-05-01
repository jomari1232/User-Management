const {
    create,
    getUserByUserEmail,
    getUserByUserId,
    getUsers,
    updateUser,
    deleteUser,
  } = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign }  = require("jsonwebtoken")
require("dotenv").config();
const { validationResult } = require('express-validator');

  module.exports = {
    createUser: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        getUsers((err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            const len = results.length
            const emails = []
            for(let i=0; i < len; i++){
                emails.push(results[i].email)
            }
            if(emails.indexOf(body.email)!== -1){
                return res.status(500).json({
                    success: 0,
                    message: "Email already Used."
                });
            }
            create(body, (err, results) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                  });
                }
                return res.status(200).json({
                  success: 1,
                  data: results
                });
              });
        });
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found"
            });
          }
          results.password = undefined;
          return res.json({
            success: 1,
            data: results
          });
        });
    },
    updateUsers: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        getUserByUserId(req.body.id, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            if (!results) {
              return res.json({
                success: 0,
                message: "Record not Found"
              });
            }
            results.password = undefined;
            const usedEmail = results.email

            getUsers((err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                const len = results.length
                const emails = []
                for(let i=0; i < len; i++){
                    emails.push(results[i].email)
                }
                const index = emails.indexOf(usedEmail);
                if (index > -1) {
                  emails.splice(index, 1); // 2nd parameter means remove one item only
                }
                if(emails.indexOf(body.email)!== -1){
                    return res.status(500).json({
                        success: 0,
                        message: "Email already Used."
                    });
                }
                updateUser(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if(!results){
                    return res.json({
                        success: 0,
                        message: "Failed to Update user"
                    });
                }
                    return res.json({
                        success: 1,
                        message: "updated successfully"
                    });
                });
            });
        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          return res.json({
            success: 1,
            data: results
          });
        });
    },
    deleteUser: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        deleteUser(req.body.id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "user deleted successfully"
            });                  
        });
      },
      login: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
          if (err) {
            console.log(err);
          }
          if (!results) {
            return res.json({
              success: 0,
              data: "Invalid email or password"
            });
          }
          const result = compareSync(body.password, results.password);
          if (result) {
            results.password = undefined;
            const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
              expiresIn: "1h"
            });
            return res.json({
              success: 1,
              message: "login successfully",
              token: jsontoken
            });
          } else {
            return res.json({
              success: 0,
              data: "Invalid email or password"
            });
          }
        });
      }
}