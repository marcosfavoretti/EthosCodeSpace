import bwipjs from 'bwip-js';

export async function generateBarcode(props: { data: string }): Promise<{ x64: string }> {
    console.log(props)
    return await new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid: 'code128',
            text: props.data,
            scale: 1,
            height: 10,
            includetext: false,
            textyalign: 'above'
        }, function (err, png) {
            if (err) {
                console.error(err);
                reject(
                    new Error("Não foi possível gerar o código de barras: " + err)
                );
            } else {
                resolve({
                    x64: png.toString('base64')
                });
            }
        });
    });
}