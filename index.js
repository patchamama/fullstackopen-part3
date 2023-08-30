/* eslint-disable comma-dangle */
/* eslint-disable semi */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Phonebook = require('./models/phonebook');

// midlewares
// Serving static files from the backend
app.use(express.static('build'));
// To parse the body of the request
app.use(express.json());
// Same origin policy
app.use(cors());
// To log messages to the console
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (request, response, next) => {
  response.send('<h1>API to Phonebook</h1>');
});

app.get('/api/persons', (request, response, next) => {
  Phonebook.find({}).then((phonebooks) => {
    response.json(phonebooks);
  });
});

app.get('/api/info', (request, response, next) => {
  Phonebook.find({}).then((phonebooks) => {
    response.send(
      'Phonebook has info for ' +
        phonebooks.length +
        ' people(s) <br> <br>' +
        new Date()
    );
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((phonebook) => {
      if (phonebook) {
        response.json(phonebook);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  const phonebook = {
    name,
    number,
  };

  Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true })
    .then((updatedPhonebook) => {
      response.json(updatedPhonebook);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing',
    });
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  });

  phonebook
    .save()
    .then((savedPhonebook) => savedPhonebook.toJSON())
    .then((savedAndFormattedPhoneNote) => {
      response.json(savedAndFormattedPhoneNote);
    })
    .catch((error) => next(error));
});

// Invalid routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// Error handling in middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
