/* eslint-disable comma-dangle */
/* eslint-disable semi */
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mandy_phonebook:${password}@cluster0.za4sftc.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Note = mongoose.model('Note', noteSchema);

if (process.argv.length < 5) {
  Note.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((note) => {
      console.log(`${note.name} ${note.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const note = new Note({
    name,
    number,
  });

  note.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
