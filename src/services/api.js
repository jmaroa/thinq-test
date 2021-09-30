import request from '../utils/request'

export const fetchTotal = () => request.get('/covid');
export const fetchCountries = (params = 'countries') => request.get(`/covid/${params}`);
