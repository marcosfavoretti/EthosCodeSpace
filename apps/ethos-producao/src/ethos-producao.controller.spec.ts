import { Test, TestingModule } from '@nestjs/testing';
import { EthosProducaoController } from './ethos-producao.controller';
import { EthosProducaoService } from './ethos-producao.service';

describe('EthosProducaoController', () => {
  let ethosProducaoController: EthosProducaoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EthosProducaoController],
      providers: [EthosProducaoService],
    }).compile();

    ethosProducaoController = app.get<EthosProducaoController>(
      EthosProducaoController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ethosProducaoController.getHello()).toBe('Hello World!');
    });
  });
});
