import { Nota } from '../classes/Nota';

export type OutputFormats =
  | 'application/pdf'
  | 'image/png'
  | 'text/html'
  | 'application/octet-stream';

export interface IGeracaoNota {
  identificador(): string | symbol;
  /**
   * com base na estrategia volta um template ja renderizado
   */
  gerar(nota: Nota[]): Promise<{
    content: Buffer | string;
    mimeType: OutputFormats;
    fileName?: string; //nao necessariamente tudo precisa ser salvo
  }>;
}
