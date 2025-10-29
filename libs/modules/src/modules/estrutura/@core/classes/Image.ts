export class Image{
    private imgPath?: string;
    constructor(private localImgPath?: string){
        if(!localImgPath) this.imgPath = undefined;
        const divisor = localImgPath?.lastIndexOf('/')
        const filename = localImgPath?.slice(divisor! + 1)//mais um é para tirar a /
        this.imgPath = filename? `http://${process.env.APPHOST}:${process.env.APPPORT}/files/image?partcode=${encodeURIComponent(filename)}`: undefined
    }
    getImagePath(): string | undefined{
        return this.imgPath
    }
    getLocalImgPath(): string | undefined{
        return this.localImgPath;
    }
}