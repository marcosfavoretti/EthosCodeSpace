import { Logger, BadRequestException } from '@nestjs/common'; // Added BadRequestException
import { Attachment } from 'nodemailer/lib/mailer';
import * as fs from 'fs';
import * as path from 'path';
import { AttachmentDto } from '@app/modules/contracts/dto/Attachment.dto';

// --- Security Constants ---
const MAX_ATTACHMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
];
// --- End Security Constants ---

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

  attachFiles(attachmentsData: Array<string | AttachmentDto>): void {
    try {
      this.attachments = attachmentsData.map((data): Attachment => {
        if (typeof data === 'string') {
          // It's a file path - perform security checks
          if (path.isAbsolute(data)) {
            throw new BadRequestException('Caminhos absolutos não são permitidos para anexos.');
          }
          if (data.includes('..')) { // Simple check for directory traversal
            throw new BadRequestException('Tentativa de travessia de diretório detectada em anexo.');
          }
          // Further enhancement: validate against a base attachments directory
          // For example: if (!data.startsWith('safe_attachments_dir/')) { throw new Error(...) }

          return {
            filename: path.basename(data),
            content: fs.createReadStream(data),
          };
        } else {
          // It's an AttachmentDto object with base64 content - perform security checks
          if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
            throw new BadRequestException(`Tipo MIME de anexo não permitido: ${data.mimetype}`);
          }

          const contentBuffer = Buffer.from(data.content, 'base64');
          if (contentBuffer.length > MAX_ATTACHMENT_SIZE_BYTES) {
            throw new BadRequestException(`Tamanho do anexo excede o limite permitido (${MAX_ATTACHMENT_SIZE_BYTES / (1024 * 1024)} MB).`);
          }

          return {
            filename: data.filename,
            content: contentBuffer,
            contentType: data.mimetype,
          };
        }
      });
    } catch (error) {
      Logger.error('Erro ao processar anexos:', error);
      // Re-throw if it's a BadRequestException, otherwise wrap it.
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Problema ao anexar arquivos.');
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
