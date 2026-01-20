import { Attachment } from 'nodemailer/lib/mailer';
import { AttachmentsFile } from './Attachments';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

export abstract class Email {
  subject: string;
  to: string[];
  from: string;
  attachments: Array<Attachment>;

  constructor(to: string[], from: string, subject: string) {
    this.from = from;
    this.subject = subject;
    this.to = this.checkValidEmail(to);
  }

  attachFiles(filepath: Array<string>): void {
    try {
      this.attachments = filepath.map((file): AttachmentsFile => {
        return {
          filename: path.basename(file),
          content: fs.createReadStream(file),
        };
      });
    } catch (error) {
      Logger.error('erro com attachment');
      throw error;
    }
  }
  // private checkfilepath(attachments: Array<string>): Array<AttachmentsFile> {
  //     if (!attachments) return
  //     // const filepahtRegex = /^(?:[a-zA-Z]:\\|\/)?(?:[^\/\\:*?"<>|\r\n]+[\/\\])*[^\/\\:*?"<>|\r\n]+(?:\.[^\/\\:*?"<>|\r\n]+)?$/
  //     console.log(attachments)
  //     // const result = attachments.every(att => filepahtRegex.test(att))

  //     if (true) {
  //         return attachments.map(
  //             (att): AttachmentsFile => {
  //                 return {
  //                     filename: path.basename(att),
  //                     filepath: att
  //                 }
  //             }
  //         )
  //     }

  // }
  private checkValidEmail(to: Array<string>): Array<string> {
    /*valida emails com regex se tiver algum que nao é valido ele da erro*/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to.every((email) => emailRegex.test(email))) {
      throw new Error('Um ou mais endereços de e-mail são inválidos.');
    }
    return to;
  }
}
