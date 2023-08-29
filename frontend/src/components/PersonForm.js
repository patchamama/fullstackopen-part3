const PersonForm = ({newName, newPhone, addPhone, handleNameChange, handlePhoneChange}) => {
     return (
      <div>
       <form onSubmit={addPhone}>
        <div>
          name: <input onChange={handleNameChange} value={newName} />
        </div>
        <div>number: <input onChange={handlePhoneChange} value={newPhone} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      </div>
    )
  }

export default PersonForm