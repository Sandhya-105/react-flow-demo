import axios from 'axios';

async function Api(lastdigit) {
  const response = await axios.get(`https://zenodo.org/api/records/${lastdigit}`);
  console.log(`https://zenodo.org/api/records/${lastdigit}`)
  return response
}

export default Api;


