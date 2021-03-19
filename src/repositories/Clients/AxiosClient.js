import axios from 'axios';

const baseDomain = 'https://api.themoviedb.org/3/';
const baseURL = `${baseDomain}`;

export default axios.create({
    baseURL
})