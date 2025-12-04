import puppeteer from 'puppeteer';

export class Html2Image {
  constructor() {}

  async convert(props: { template: string }): Promise<{ x64: Buffer }> {
    const { template } = props;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({
        width: 400, // Corresponde a 50mm a 203 DPI
        height: 240, // Corresponde a 30mm a 203 DPI
        deviceScaleFactor: 1, // Garante 1:1 pixel
      });

      await page.setContent(template);

      const labelElement = await page.$('.label');

      if (!labelElement) {
        console.error(
          'Erro: Não foi possível encontrar o elemento .label na página.',
        );
        await browser.close();
        throw new Error('Problema ao gerar a etiqueta');
      }

      const extension = '.png';

      const response = await labelElement.screenshot({
        omitBackground: false,
      });

      return {
        x64: Buffer.from(response),
      };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
