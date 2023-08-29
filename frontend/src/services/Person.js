import axios from 'axios';

const URL = '/api/persons';

const getAll = () => {
  return axios.get(URL).then((response) => response.data);
};

const addNewPerson = (newPerson) => {
  return axios.post(URL, newPerson).then((response) => response.data);
};

const updatePerson = (id, data) => {
  return axios.put(`${URL}/${id}`, data).then((response) => response.data);
};

const deletePerson = (id) => {
  axios.delete(`${URL}/${id}`);
};

export default { getAll, addNewPerson, updatePerson, deletePerson };
