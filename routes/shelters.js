const express = require('express');
const { response, request } = require('express');
const router = express.Router();



router.get('/', (request, response) => {
    var shelters = [
        'Sisters of Mercy Immaculata Hall',
        'Doorway to Dignity',
        'Lady Athena\'s House',];

        response.status(200).json(JSON.stringify(shelters));   

});

router.get('/map', (request, response) => {

    response.status(200).json(JSON.stringify('https://goo.gl/maps/PV3qgx1QsqUT3cov7'));  
    
});

module.exports = router;