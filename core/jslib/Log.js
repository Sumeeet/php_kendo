const Log = (message) => {
  return console.log(message);
};

const EventLogs = function (command) {};

const Message = (type, source, message) => {
  const date = new Date();
  const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return {
    type: () => type,
    source: () => source,
    message: () => message,
    toString: () => `${day} ${time} [${type}] ${source} ${message}`,
  };
};
