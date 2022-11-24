const Log = (message) => {
  console.log(message);
};

const EventLogs = function (command) {};

class Message {
  constructor(type, source, message) {
    this.date = new Date();
    this.day = `${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDay()}`;
    this.time = `${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;
    this.type = type;
    this.source = source;
    this.message = message;
  }

  toString() {
    return `${this.day} ${this.time} [${this.type}] source:${this.source} ${this.message}`;
  }

  toKey(prop) {
    return prop;
  }
}

class GridMessage extends Message {
  constructor(type, source, rowIndex, colIndex, message) {
    super(type, source, message);
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
  }

  toString() {
    return `${this.day} ${this.time} [${this.type}] source:${this.source} ${this.message} at cell [${this.rowIndex}, ${this.colIndex}]`;
  }

  toKey(prop) {
    return `${prop}_${this.rowIndex}_${this.colIndex}`;
  }
}
