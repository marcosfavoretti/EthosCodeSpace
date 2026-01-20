import { Email } from './Email';

export class EmailHtml extends Email {
  html: string;
  constructor(to: Array<string>, from: string, subject: string, html: string) {
    super(to, from, subject);
    this.html = html;
  }
  //sobre carregamento do construtor
  static fromConfigObject(props: {
    to: string[];
    from: string;
    subject: string;
    html: string;
  }): EmailHtml {
    return new EmailHtml(props.to, props.from, props.subject, props.html);
  }
}
