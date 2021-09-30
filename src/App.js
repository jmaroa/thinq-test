import { useEffect, useReducer, useState } from 'react'
import './App.scss'
import loader from './images/loader.svg';
import { fetchTotal, fetchCountries} from './services/api'

const FETCH_STATUSES = Object.freeze({
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  COMPLETED: 'COMPLETED'
})

const REDUCER_ACTIONS = Object.freeze({
  SET_COUNTRIES: 'SET_COUNTRIES',
  SET_TOTAL_RECORDS: 'SET_TOTAL_RECORDS',
  SET_COUNTRIES_LOADING_STATUS: 'SET_COUNTRIES_LOADING_STATUS',
  SET_TOTAL_LOADING_STATUS: 'SET_TOTAL_LOADING_STATUS'
}) 

const initialState = { 
  total: null,
  countries: [],
  totalStatus: FETCH_STATUSES.IDLE,
  countriesStatus: FETCH_STATUSES.IDLE
}

const reducer = ((state = initialState, action) => {
  switch(action.type) {
    case REDUCER_ACTIONS.SET_COUNTRIES: return { ...state, countries: action.payload }
    case REDUCER_ACTIONS.SET_TOTAL_RECORDS: return { ...state, total: action.payload }
    case REDUCER_ACTIONS.SET_TOTAL_LOADING_STATUS: return { ...state, totalStatus: action.payload }
    case REDUCER_ACTIONS.SET_COUNTRIES_LOADING_STATUS: return { ...state, countriesStatus: action.payload }
    default: return state
  }
})

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [thereIsMoreToLoad, setThereIsMoreToLoad] = useState(false)

  useEffect(() => {
    setFilteredCountries(state.countries.slice(0,10))
  }, [state.countries])

  useEffect(() => {
    const nextSlice = state.countries.length - filteredCountries.length
    const notMoreToLoad = nextSlice <= 0 || filteredCountries.length >= state.countries.length
    setThereIsMoreToLoad(!notMoreToLoad)
  }, [filteredCountries, state.countries])

  // Load total results
  useEffect(() => {
    const fetchTotalResults = async () => {
      dispatch({type: REDUCER_ACTIONS.SET_TOTAL_LOADING_STATUS, payload: FETCH_STATUSES.LOADING})
      const { cases = 0, deaths = 0, recovered = 0 } = await fetchTotal()
      const results = { cases, deaths, recovered }
      dispatch({type: REDUCER_ACTIONS.SET_TOTAL_RECORDS, payload: results})
      dispatch({type: REDUCER_ACTIONS.SET_TOTAL_LOADING_STATUS, payload: FETCH_STATUSES.COMPLETED})
    }
    fetchTotalResults()
  }, [])

  // Load countries results
  useEffect(() => {
    const fetchCountriesResults = async () => {
      dispatch({type: REDUCER_ACTIONS.SET_COUNTRIES_LOADING_STATUS, payload: FETCH_STATUSES.LOADING})
      const result = await fetchCountries()
      const sorted = result.sort((a, b) => b.recovered - a.recovered)
      dispatch({type: REDUCER_ACTIONS.SET_COUNTRIES, payload: sorted})
      dispatch({type: REDUCER_ACTIONS.SET_COUNTRIES_LOADING_STATUS, payload: FETCH_STATUSES.COMPLETED})
    }
    fetchCountriesResults()
  }, [])

  const handleLoadMoreCountries = (ev) => {
    ev.preventDefault()
    const { countries } = state
    setFilteredCountries(countries.slice(0, filteredCountries.length + 50))
  }

  const renderLoader = () =>{
    return (
      <div className="loader">
        <img src={loader} className="app-loader" alt="loader" />
      </div>
    )
  }

  const renderTotalTable = () => {
    const { total: totalResults, totalStatus } = state
    if (totalStatus !== FETCH_STATUSES.COMPLETED) return renderLoader()
    return (
      <div className="app-highlights">
        {
          Object.keys(totalResults).map(
            resultKey => (
              <div key={resultKey} className="app-highlights-item">
                <h2>{resultKey}</h2>
                <p>{new Intl.NumberFormat('en-IN').format(totalResults[resultKey])}</p>
              </div>
            )
          )
        }  
      </div>
    )
  }

  const renderCountriesTable = () => {
    const { countriesStatus } = state
    if (countriesStatus !== FETCH_STATUSES.COMPLETED) return renderLoader()
    return (
      <div className="app-countries">
        {
          filteredCountries.map(
            result => (
              <div key={result.country} className="app-countries-row">
                <h2 className="col">{result.country}</h2>
                <div className="col app-countries-row-item">
                  <h3>Cases</h3>
                  <p>{new Intl.NumberFormat('en-IN').format(result.cases)}</p>
                </div>
                <div className="col app-countries-row-item">
                  <h3>Deaths</h3>
                  <p>{new Intl.NumberFormat('en-IN').format(result.deaths)}</p>
                </div>
                <div className="col app-countries-row-item">
                  <h3>Recovered</h3>
                  <p>{new Intl.NumberFormat('en-IN').format(result.recovered)}</p>
                </div>
              </div>
            )
          )
        }    
      </div>
    )
  } 

  return (
    <div className="app">
      <header className="app-header">
        <h1><span>Global</span> COVID-19 <span>Report</span></h1>
        { renderTotalTable() }
      </header>
      <section className="app-content">
        { renderCountriesTable() }
        {
          thereIsMoreToLoad
            ? <button className="app-load-more" onClick={handleLoadMoreCountries}>Load More</button>
            : ''
        }
        
      </section>
      <footer>
        <a href="https://disease.sh/">API reference</a>
        <div>
          ThinQ test done by <a href="https://github.com/jmaroa">Mario Rodriguez</a>
        </div>
      </footer>
    </div>
  )
}

export default App
