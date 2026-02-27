export class ProblensOnRefresh extends Error{
    constructor(message: string){
        super(message)
        this.name = 'Problema ao atualizar'
    }
}