export class AlreadyRefreshing extends Error{
    constructor(message: string){
        super(message)
        this.name = 'Dataset em atualização'
    }
}