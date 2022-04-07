const express = require('express');
const { response, request } = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    var shelters = [
        'Doorway to Dignity',
        'Sisters of Mercy Immaculata Hall',
        'Lady Athena\'s House',];

        response.status(200).json(JSON.stringify(shelters));   

});

router.get('/map', (request, response) => {


    var googleMapsCoordinate = ['https://goo.gl/maps/wV8vdhsktQ1J4hdcA', 'https://goo.gl/maps/PV3qgx1QsqUT3cov7']

    var selectedCoordinate = googleMapsCoordinate[Math.floor(Math.random() * googleMapsCoordinate.length)];
    response.status(200).json(JSON.stringify(selectedCoordinate));  
    
});

module.exports = router;