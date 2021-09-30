const httpStatus = require('http-status');

const { fetchAllCovidResults, fetchCountriesCovidResults } = require('../services/covid.service')

const getAllCovidResultsController = async (_, res) => {
  try {
    const response = await fetchAllCovidResults()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(response)
  } catch (err) {
    // TODO: Improve error handling
    res.status(httpStatus.NOT_FOUND).send({ message: err.message })
  }
}

const getCountriesCovidResultsController = async (req, res) => {
  try {
    const response = await fetchCountriesCovidResults(req.params)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(response)
  } catch (err) {
    // TODO: Improve error handling
    res.status(httpStatus.NOT_FOUND).send({ message: err.message })
  }
};

module.exports = {
  getAllCovidResultsController,
  getCountriesCovidResultsController
}
