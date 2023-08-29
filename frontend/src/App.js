import { useState, useEffect } from 'react';
import Persons from './components/Persons.js';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm.js';
import Filter from './components/Filter.js';
import phoneServices from './services/Person.js';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMsg, setNotificationMsg] = useState({
    type: null,
    msg: null,
  });

  useEffect(() => {
    phoneServices
      .getAll()
      .then((allPersons) => {
        setPersons(allPersons);
      })
      .catch((error) => console.log(error));
  }, []);

  const addPhone = (event) => {
    event.preventDefault();
    const existNewName = persons.reduce(
      (a, b) => a || b.name === newName,
      false
    );

    if (existNewName) {
      const newNameInDB = persons.find((p) => p.name === newName);
      if (
        window.confirm(
          `${newNameInDB.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        phoneServices
          .updatePerson(newNameInDB.id, { ...newNameInDB, number: newPhone })
          .then((returnedPhone) => {
            setPersons(
              persons.map((person) =>
                person.id !== newNameInDB.id ? person : returnedPhone
              )
            );
          })
          .catch((error) => {
            setNotificationMsg({
              type: 'error',
              msg: `Person ${newNameInDB.name} was already removed from server!`,
            });
            setTimeout(() => {
              setNotificationMsg({ type: null, msg: null });
            }, 5000);
          });
        setNotificationMsg({ type: 'ok', msg: `Update ${newName}!` });
        setTimeout(() => {
          setNotificationMsg({ type: null, msg: null });
        }, 5000);
      }
      setNewName('');
      setNewPhone('');
    } else {
      phoneServices
        .addNewPerson({ name: newName, number: newPhone })
        .then((returnedPhone) => {
          setPersons(persons.concat(returnedPhone));
        })
        .catch((error) => console.log(error));

      setNotificationMsg({ type: 'ok', msg: `Add ${newName}!` });
      setTimeout(() => {
        setNotificationMsg({ type: null, msg: null });
      }, 5000);
      setNewName('');
      setNewPhone('');
    }
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      console.log(person);
      phoneServices.deletePerson(person.id);

      console.log('delete ', person);
      setNotificationMsg({ type: 'ok', msg: `Delete ${person.name}!` });
      setTimeout(() => {
        setNotificationMsg({ type: null, msg: null });
      }, 5000);
      setPersons(persons.filter((item) => item.id !== person.id));
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMsg} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        addPhone={addPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deleteHandle={deletePerson} />
    </div>
  );
};

export default App;
