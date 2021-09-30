const express = require('express');
const router = express.Router();

const { getAllCovidResultsController, getCountriesCovidResultsController } = require('../controllers/covid.controller');

router.get('/', getAllCovidResultsController);
router.get('/:countryName', getCountriesCovidResultsController);

module.exports = router;
