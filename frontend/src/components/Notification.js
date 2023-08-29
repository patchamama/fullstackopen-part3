const Notification = ({ message }) => {
    const classval = message.type === 'error' ? 'error' : 'ok'
    if (message.type === null) {
      return null
    }
  
    return (
      <div className={classval}>
        {message.msg}
      </div>
    )
  }


export default Notification