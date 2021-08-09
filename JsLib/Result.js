const Result = (pass = true, message) => {
    const result = {
        pass: pass,
        messages: [message]
    }

    const setPass = (pass) => result['pass'] = pass;

    const isPass = () => result['pass'];

    const pushMessage = (msg) => { result['messages'].push(msg) }

    const getMessages = () => result['messages'];

    return { isPass, setPass, getMessages, pushMessage };
}