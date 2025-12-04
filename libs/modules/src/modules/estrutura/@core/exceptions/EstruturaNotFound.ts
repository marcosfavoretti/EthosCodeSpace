export class EstruturaNotFound extends Error {
  constructor(partcode: string) {
    super(`Estrutura ${partcode} não encontrada!`);
  }
}
