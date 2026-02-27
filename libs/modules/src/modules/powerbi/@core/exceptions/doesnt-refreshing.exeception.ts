export class DoesntRefresing extends Error{
    constructor(message: string){
        super(message)
        this.name = 'Não foi iniciado a atualização'
    }
}