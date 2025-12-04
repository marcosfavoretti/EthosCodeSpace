export class ItemNotFoundException extends Error {
  constructor(partcode: string) {
    super(`Item ${partcode} não encontrado!`);
  }
}
