/* eslint-disable comma-dangle */
/* eslint-disable semi */
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

// midlewares
// Same origin policy
app.use(cors());
// To parse the body of the request
app.use(express.json());
// To log messages to the console
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
// Serving static files from the backend
app.use(express.static('build'));

let phonebooks = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>API to Phonebook</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(phonebooks);
});

app.get('/api/info', (request, response) => {
  response.send(
    'Phonebook has info for ' +
      phonebooks.length +
      ' people(s) <br> <br>' +
      new Date()
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const phonebook = phonebooks.find((phonebook) => phonebook.id === id);

  if (phonebook) {
    response.json(phonebook);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebooks = phonebooks.filter((phonebook) => phonebook.id !== id);

  response.status(204).end();
});

const getRandomId = () => {
  const min = phonebooks.length;
  return Math.random() * (100000 - min) + min;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing',
    });
  }

  const nameExist = phonebooks.find(
    (phonebook) => phonebook.name === body.name
  );
  if (nameExist) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const phonebook = {
    name: body.name,
    number: body.number,
    id: getRandomId(),
  };

  phonebooks = phonebooks.concat(phonebook);

  response.json(phonebook);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
