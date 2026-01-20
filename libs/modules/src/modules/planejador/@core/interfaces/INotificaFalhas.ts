export const INotificaFalhas = Symbol('INotificaFalhas');
export interface INotificaFalhas {
  notificarFalha<T extends Error>(props: {
    to: string[];
    subject: string;
    message: string;
    errors?: T[];
  }): Promise<void>;
}
