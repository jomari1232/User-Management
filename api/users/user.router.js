const router = require("express").Router();
const { check } = require('express-validator');
const {
    createUser,
    login,
    getUserByUserId,
    getUsers,
    updateUsers,
    deleteUser
  } = require("./user.controller");
const { checkToken } = require("../../auth/token_validation");

router.get("/", checkToken, getUsers);
router.post("/", 
    check('firstName').notEmpty(), 
    check('lastName').notEmpty(), 
    check('gender').notEmpty(), 
    check('email').notEmpty(), 
    check('password').notEmpty(), 
    check('number').notEmpty(), 
    check('postCode').notEmpty(), 
    check('address').notEmpty(), 
    createUser
);
router.get("/:id", checkToken, getUserByUserId);
router.post("/login", checkToken,
    check('email').notEmpty(), 
    check('password').notEmpty(), 
    login
);
router.patch("/", checkToken,
    check('id').notEmpty(), 
    check('firstName').notEmpty(), 
    check('lastName').notEmpty(), 
    check('gender').notEmpty(), 
    check('email').notEmpty(), 
    check('password').notEmpty(), 
    check('number').notEmpty(), 
    check('postCode').notEmpty(), 
    check('address').notEmpty(),  
    updateUsers
);
router.delete("/", checkToken,
    check('id').isArray({ min: 1}).notEmpty(), 
    deleteUser
);

module.exports = router;