import { Email } from "./Email"

export class EmailHtml extends Email {
    html: string
    constructor(to: Array<string>, from: string, subject: string, html: string) {
        super(to, from, subject)
        this.html = html
    }
}