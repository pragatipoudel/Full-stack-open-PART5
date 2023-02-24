const Error = ({ message }) => {
    const errorStyle = {
        color: 'red',
        background: 'lightgray',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === '') {
        return null
    } else {
        return (
            <div style={errorStyle} className='error'>
                {message}
            </div>
        )
    }
}

export default Error