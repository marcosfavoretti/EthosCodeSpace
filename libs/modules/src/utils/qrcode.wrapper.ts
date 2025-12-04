import QRCode from 'qrcode';

export async function generateQrcode(props: {
  data: string;
}): Promise<{ x64: string }> {
  const value = await QRCode.toDataURL(props.data, { type: 'image/jpeg' });
  console.log(value);
  return {
    x64: value,
  };
}
