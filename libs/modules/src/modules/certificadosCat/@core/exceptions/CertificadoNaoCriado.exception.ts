export class CertificadoNaoCriadoException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CertificadoNaoCriadoException';
    }
}   