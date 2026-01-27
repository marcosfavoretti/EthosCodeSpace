export class WifiRegisterLink {
    constructor(private props: {
        serviceLink: string,
        randomParameter: string
    }) { }

    getLink() {
        return this.props.serviceLink.concat(`/${this.props.randomParameter}`);
    }
}