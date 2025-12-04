import { Email } from "./Email"


export class EmailText extends Email {
    text: string
    constructor(to: Array<string>, from: string, subject: string, text: string) {
        super(to, from, subject)
        this.text = text
    }
}