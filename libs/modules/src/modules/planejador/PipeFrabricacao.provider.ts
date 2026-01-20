import { SetorService } from "./@core/abstract/SetorService";
import { SetorBanho } from "./@core/services/SetorBanho";
import { SetorLixa } from "./@core/services/SetorLixa";
import { SetorMontagem } from "./@core/services/SetorMontagem";
import { SetorPinturaLiq } from "./@core/services/SetorPinturaliq";
import { SetorPinturaPo } from "./@core/services/SetorPinturaPo";
import { SetorSolda } from "./@core/services/SetorSolda";

export const PIPE_FABRICACAO = Symbol('PIPE_FABRICACAO');

export const PipeFrabricacaoProvider = {
  provide: PIPE_FABRICACAO,
  inject: [
    SetorSolda,
    SetorLixa,
    SetorBanho,
    SetorPinturaLiq,
    SetorPinturaPo,
    SetorMontagem,
  ],
  useFactory: (
    solda: SetorSolda,
    lixa: SetorLixa,
    banho: SetorBanho,
    pliq: SetorPinturaLiq,
    ppo: SetorPinturaPo,
    montagem: SetorMontagem,
  ): SetorService => {
    solda
      .setNextSetor(lixa)
      .setNextSetor(banho)
      .setNextSetor(pliq)
      .setNextSetor(ppo)
      .setNextSetor(montagem);
    return solda;
  },
};
