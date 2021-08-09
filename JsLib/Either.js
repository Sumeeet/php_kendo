class Either {
    constructor (val) {
        this.$val = val;
    }

    isNothing() {
        return this.$val === null || this.$val === 'undefined';
    }

    static of(val) {
        return new Right(val);
    }
}

class Left extends Either {
    get isLeft() {
        return true;
    }

    get isRight() {
        return false;
    }

    static of(x) {
        throw new Error('`of` called on class Left (value) instead of Either (type)');
    }

    map(func) {
        return this;
    }

    join() {
        return this;
    }

    chain(func) {
        return this;
    }
}

class Right extends Either {
    get isLeft() {
        return false;
    }

    get isRight() {
        return true;
    }

    static of(x) {
        throw new Error('`of` called on class Right (value) instead of Either (type)');
    }

    map(func) {
        return Either.of(func(this.$val));
    }

    join() {
        return this.$val;
    }

    chain(func) {
        return func(this.$val);
    }
}