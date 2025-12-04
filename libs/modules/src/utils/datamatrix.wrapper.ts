import { toBuffer } from 'bwip-js';

export async function generateDataMatrix(props: {
  data: string;
}): Promise<{ x64: string }> {
  const png = await toBuffer({
    bcid: 'datamatrix',
    text: props.data,
    scale: 4, // diminui o tamanho dos pontos (quanto menor, mais fino)
    includetext: true,
    backgroundcolor: 'FFFFFF',
    monochrome: true,
  });
  const x64 = `${png.toString('base64')}`;
  return {
    x64,
  };
}
