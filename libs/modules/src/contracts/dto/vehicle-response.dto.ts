import { VeiculoEstado } from "@app/modules/modules/controleVeiculos/@core/enum/VeiculoEstados";

export class VehicleResponseDto {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  createdAt: Date;
  updatedAt: Date;
  status:VeiculoEstado; // Assuming a status to track if the vehicle is inside or outside
}
