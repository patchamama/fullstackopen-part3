
export const Persons = ({persons, filter, deleteHandle}) => {
    const filterPersons =  filter === '' ? persons : persons.filter( person => person.name.toLowerCase().includes(filter.toLowerCase()) )
    return (
      <table>
        <tbody>
        {filterPersons.map(person => 
          <tr key={person.name}>
            <td>{person.name}</td>
            <td> {person.number}</td> 
            <td>
                <button onClick={() => deleteHandle(person)}>delete</button>
            </td>
          </tr> )}
          </tbody>
      </table>
    )
  }

export default Persons