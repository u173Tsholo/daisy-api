const express = require('express');
const { response, request } = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Str = require('@supercharge/strings');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');

console.log('users class')

//create user role
router.post('/createRole', (request, response) => {
    const role = request.body.role;
    Role.create({
        role 
    })
    .then( data => {
        response.status(201).send("Role created");
    })
    .catch( error => { 
        //console.log(error)
        response.status(500).send("Server error");
    })

})

//
router.post('/createUser', (request, response) => {
    const email = request.body.email;
	const password = bcrypt.hashSync(request.body.password, 10);
    const name = request.body.name;
    const phonenumber = request.body.phoneNumber;
    const address = request.body.address;
    const postalcode = request.body.postalCode;
    var token = Str.random();
    var roleID;

    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!regex.test(email))
	{//checking if email is valid
		response.status(403).send("Invalid email, must be a valid email address");
    }
    else{
        Role.findAll( {raw: true, where: { role: {[Op.like]:  request.body.role } } } )
        .then ( data => {
            console.log("data: ", data, " --->>>> ", data[0].id)
            roleid = data[0].id;
        })
        .catch( error => {
            console.log("error: " , error) 
            response.status(500).send("Server error");
        })

        User.findAll( { where: { email: {[Op.like]:  request.body.email } } } )
        .then( user => {
            if(user.length == 0){
                console.log("--> ", name, email, password, token, phonenumber, address, postalcode, roleid);
                User.create({
                    name, email, password, token, phonenumber, address, postalcode, roleid
                })
                .then( data => {
                    console.log('done inserting');
                    response.status(201).json({ "token": data.token, "name": data.name});
                })
                .catch( error => { 
                    console.log('failed to insert, ', error);
                    response.status(500);
                })
            }
            else {
                response.status(409).send("User already exists. Create new user");
            }
        })
        .catch( error => { 
            console.log(error);
            response.status(500).send("Server Error");
        })
    }
});

router.post('/login', (request, response) => {
    console.log('here: ', request.body);
    const password = request.body.password;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!regex.test(request.body.email))
	{
		response.status(403).send("Invalid email, must be a valid email address");
    }
    else{
        console.log('*********');
        User.findAll( { raw: true, where: { email: {[Op.like]:  request.body.email } } } )
        .then( user => {
            if(user.length == 0){
                response.status(404).send("User not found");
                console.log('failed to find ', user.length)
            }
            else {
                console.log('here');
                bcrypt.compare(password, user[0].password, (err, res) => {
                    if(res){
                        if(user[0].roleid == 1){
                        response.status(201).json({"token": user[0].token, "name": user[0].name, "role":"Admin"});
                        }
                        else{
                            response.status(201).json({"token": user[0].token, "name": user[0].name, "role":"User"});
                        }
                    }
                    else {
                        response.status(403).send("Passwords do not match");
                    }
                })
            }
        })
        .catch( error => { 
            console.log('---blah')
            response.status(500).send("Server Error");
        })
    }
});

router.post('/getUser', (request, response) => {
    User.findAll( { raw: true, where: { token: {[Op.like]:  request.body.token } } } )
    .then( user => {
        response.status(200).json({"name": user[0].name, "email": user[0].email});
    })
    .catch();
});



module.exports = router;