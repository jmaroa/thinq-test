const fetch = require('node-fetch')

const PUBLIC_API_BASE_URL = 'https://disease.sh/v3/covid-19'

// Returns total results
const fetchAllCovidResults = async () => {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/all`)
  return response.json()
}

// returns total result for all countries or specific country
const fetchCountriesCovidResults = async (params) => {
  const { countryName } = params
  let finalParams = 'countries'
  if (countryName && countryName !== 'countries') finalParams += `/${countryName}`
  const response = await fetch(`${PUBLIC_API_BASE_URL}/${finalParams}`)
  return response.json()
}

module.exports = {
  fetchAllCovidResults,
  fetchCountriesCovidResults
}
