export class WifiVoucherName {
    constructor(private props: {
        visitanteEmpresa: string,
        visitanteNome: string
    }) { }

    getVoucher(): string {
        return `${this.props.visitanteEmpresa}-${this.props.visitanteNome}-${new Date().getTime()}`
    }
}