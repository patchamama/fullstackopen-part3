const Filter = ({filter, handleFilterChange}) => {
    return (
        <div>
        filter shown with: <input onChange={handleFilterChange} value={filter} />
        </div>
    )
  }

export default Filter