const express = require('express');
const { response, request } = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Str = require('@supercharge/strings');
const bcrypt = require('bcrypt');
const TextChannel = require('../models/TextChannel');
const Role = require('../models/Role');
const { json } = require('sequelize');
const SOS = require('../models/SOS');


//get all current channels
router.get('/getCurrentChannels', (request, response) => {
    console.log("Now here");
    let index = 0;
    let channelObject = [];
    let array = [];
    let channelCounter;
    TextChannel.findAll( { raw: true, where: { resolved: false } } )
    .then( data => {
        console.log("----> ", data);
        channelCounter = Object.keys(data).length;
        array = data;
        array.forEach(element => {
            //JSON.parse(element.message);
            channelObject.push(element.message);
            index++;
            if(index == channelCounter)
            {
                channelObject = JSON.parse(channelObject);
                console.log("xxxxx ", channelObject);
                response.status(200).json(channelObject);
                //break;
            }
        });
        // let messageObject = JSON.parse(data[0].message);
        // console.log("Eureka, ", "from ", messageObject[0].user, " message " ,messageObject[0].message, " time ", messageObject[0].timestamp);
        // response.status(200).json({"from": messageObject[0].user, "message": messageObject[0].message, "time":messageObject[0].timestamp});
    })
    .catch( error => {
        console.log("Error: ", error)
    });
});

//create new channel
router.post('/createNewChannel', (request, response) => {

    let userid;
    let adminid;
    let adminRoleid;
    let userName;
    let adminRole;
    let resolved = false;
    
    //get user id
    User.findAll( { raw: true, where: { token: {[Op.like]:  request.body.token } } } )
    .then ( data => {
        userid = data[0].id;
        userName = data[0].name;

        //get id of the specified role
        Role.findAll( { raw: true, where: { role: {[Op.like]:  request.body.role } } } )
        .then ( data => {
            adminRoleid = data[0].id;
            adminRole = data[0].role;

            //////////////
            //get admin details
            User.findAll( { raw: true, where: { roleid: adminRoleid } } )
            .then ( data => {
                adminid = data[0].id;

                TextChannel.findAll( { raw: true, where: { userid: userid } && {resolved: false} })
                .then( data => {
                    if(data[0] != null){
                        console.log("Not null so try update, ", data)
                        let currentMessage = JSON.parse(data[0].message);
                        //now create the json object for the current message
                        var todaysDate = new Date();
                        var currentTime = todaysDate.getHours() + ":" + todaysDate.getMinutes() + ":" + todaysDate.getSeconds();
                        let userMessageObjectArray = [];
                        let userMessageObject = {
                            "message": request.body.message,
                            "timestamp": currentTime,
                            "user": userName,
                            "sentTo": adminid
                        }

                        currentMessage.push(userMessageObject);
                        let message = JSON.stringify(currentMessage);

                        TextChannel.update(
                             { message: message },
                             { where: { userid: userid } }
                        )
                        .then( () => { 
                            response.status(201).send("Message saved");
                        } )
                        .catch( error => {
                            //console.log("~~~~~~~~~~", error);
                            response.send("Server error: " + error);
                        })
                    }
                    else{
                        console.log("Creatiooooooooooon");
                        //now create the json object for the current message
                        var todaysDate = new Date();
                        var currentTime = todaysDate.getHours() + ":" + todaysDate.getMinutes() + ":" + todaysDate.getSeconds();
                        let userMessageObjectArray = [];
                        let userMessageObject = {
                            "message": request.body.message,
                            "timestamp": currentTime,
                            "user": userName,
                            "sentTo": adminid
                        }

                        userMessageObjectArray.push(userMessageObject);
                        let message = JSON.stringify(userMessageObjectArray);

                        TextChannel.create({
                            userid, adminid, resolved, message 
                        })
                        .then( data => {
                            response.status(201).send("Message sent");
                        })
                        .catch( error => { 
                            console.log(error)
                            response.status(500).send("Server error");
                        });
                    }
                })
                .catch( error => {})
               // const role = request.body.role;
            })
            .catch( error => {
                console.log("error here: 1 ", error);
            });
        })
        .catch( error => {
            console.log("error here: 1 ", error);
        })
    })
    .catch( error => {
        console.log("error here: 1 ", error);
    }); 
});

router.post("/replyToUser", (request, response) => {
    const token = request.body.token;
    const message = request.body.message;

    console.log("Ma body:", request.body);

    let userid;
    let adminid;

    User.findOne({ raw: true, where: { token: {[Op.like]:  request.body.token } } })
    .then( data => {
        adminid = data.id;

        User.findOne({ raw: true, where: { name: {[Op.like]:  request.body.user } } })
        .then( data => {
            userid = data.id;

            //reply to chat
            TextChannel.findAll( { raw: true, where: { adminid: adminid } && { userid: userid } && {resolved: false} } )
            .then( data => {
                if(data){
                    console.log("Not null so try update, ", data)
                    let currentMessage = JSON.parse(data[0].message);
                    //now create the json object for the current message
                    var todaysDate = new Date();
                    var currentTime = todaysDate.getHours() + ":" + todaysDate.getMinutes() + ":" + todaysDate.getSeconds();
                    let userMessageObjectArray = [];
                    let userMessageObject = {
                        "message": request.body.message,
                        "timestamp": currentTime,
                        "user": "Admin",
                        "sentTo": request.body.user
                    }

                    currentMessage.push(userMessageObject);
                    let message = JSON.stringify(currentMessage);

                    TextChannel.update(
                         { message: message },
                         { where: { userid: userid } && { userid: userid } && { resolved:false } }
                    )
                    .then( () => { 
                        response.status(201).send("Message saved");
                    } )
                    .catch( error => {
                        console.log("~~~~~~~~~~", error);
                        //response.send("Server error: " + error);
                    })
                }
            })
            .catch( error => {
                //
            });
        })
        .catch( error => {
            console.log("Error ", error);
        });
    })
    .catch( error => {
        console.log("Error ", error);
    });
});



//sos endpoints
router.post('/newSOS', (request, response) => {
    let userid;
    const rating = request.body.rating;
    let service;
    if(rating == 1){
        service = "security services";
    }
    else if(rating === 2){
        service = "contact SAPS"
    }
    else{
        service = "ambulance, police and security services"
    }
        

    User.findOne({ raw: true, where: { token: {[Op.like]:  request.body.token } } })
    .then( data => {
        userid = data.id;

        console.log("********** ", userid, rating)

        SOS.create({
            userid, rating, service
        })
        .then( () => {
            response.status(201).send("Message sent");
        })
        .catch( error => { 
            console.log("Hi ", error)
            //response.status(500).send("Server error");
        });
    })
    .catch( error => {
        console.log("Error ", error);
    })
});
//

module.exports = router;