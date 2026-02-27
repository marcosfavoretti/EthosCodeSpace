export class PowerbiState {
    constructor(
        private props: {
            authorName?: string,
            describe: string,
            using: boolean
        }
    ) {
        this.props.describe = this.getMessage();
    }

    asDto() {
        return {
            authorName: this.props.authorName,
            describe: this.props.describe,
            using: this.props.using
        }
    }

    setUsing(using: boolean) {
        this.props.using = using;
    }


    setAuthor(author: string) {
        this.props.authorName = author;
    }

    getDescribe() {
        return this.props.describe;
    }

    setDescribe(describe: string) {
        this.props.describe = describe;
    }

    getAuthor() {
        return this.props.authorName;
    }

    getMessage() {
        return this.props.authorName ? `[${this.props.authorName}]: `.concat(this.props.describe) : this.props.describe;
    }

    getUsing() {
        return this.props.using
    }

    static DEFAULT_STATE() {
        return new PowerbiState({
            describe: 'N/A',
            using: false
        })
    }

}