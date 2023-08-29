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
  Phonebook.find({}).then((phonebooks) => {
    response.json(phonebooks);
  });
});

// app.get('/api/persons', (request, response) => {
//   response.json(phonebooks);
// });

app.get('/api/info', (request, response) => {
  response.send(
    'Phonebook has info for ' +
      phonebooks.length +
      ' people(s) <br> <br>' +
      new Date()
  );
});

app.get('/api/persons/:id', (request, response) => {
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

// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const phonebook = phonebooks.find((phonebook) => phonebook.id === id);

//   if (phonebook) {
//     response.json(phonebook);
//   } else {
//     response.status(404).end();
//   }
// });

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   phonebooks = phonebooks.filter((phonebook) => phonebook.id !== id);

//   response.status(204).end();
// });

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const phonebook = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true })
    .then((updatedPhonebook) => {
      response.json(updatedPhonebook);
    })
    .catch((error) => next(error));
});

// const getRandomId = () => {
//   const min = phonebooks.length;
//   return Math.random() * (100000 - min) + min;
// };

app.post('/api/persons', (request, response) => {
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

  phonebook.save().then((savedPhonebook) => {
    response.json(savedPhonebook);
  });
});

// app.post('/api/persons', (request, response) => {
//   const body = request.body;

//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'The name or number is missing',
//     });
//   }

//   const nameExist = phonebooks.find(
//     (phonebook) => phonebook.name === body.name
//   );
//   if (nameExist) {
//     return response.status(400).json({
//       error: 'name must be unique',
//     });
//   }

//   const phonebook = {
//     name: body.name,
//     number: body.number,
//     id: getRandomId(),
//   };

//   phonebooks = phonebooks.concat(phonebook);

//   response.json(phonebook);
// });

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
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
