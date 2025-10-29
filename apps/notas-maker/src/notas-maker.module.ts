import { Module } from '@nestjs/common';
import { NotasController } from './controller/notas-controller';
import { NotasModule } from '@app/modules/modules/notas/Notas.module';

@Module({
  imports: [NotasModule],
  controllers: [NotasController],
  providers: [],
})
export class NotasMakerModule {}
