import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResponsePaginatorDTO<T> {
  // A propriedade 'data' é definida AQUI para satisfazer o TypeScript
  // e permitir que o UseCase retorne ResponsePaginatorDTO<MeuDTO> com 'data'.
  // MAS, O @ApiProperty() NÃO É USADO AQUI.
  data: T[];

  @ApiProperty()
  total: number;
  
  @ApiProperty()
  page: number;
  
  @ApiProperty()
  limit: number;
  
  @ApiProperty()
  totalPages: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}


// Função de fábrica permanece a mesma para adicionar o @ApiProperty() condicionalmente.
export function PaginatedResponseDto<T>(classRef: Type<T>): Type<ResponsePaginatorDTO<T>> {
  
  class ResponsePaginatorHost extends ResponsePaginatorDTO<T> {
    // Aqui, o @ApiProperty() é APENAS para o Swagger, 
    // forçando a tipagem correta de T[] para a documentação.
    @ApiProperty({
      type: [classRef],
      description: `Lista de itens paginados do tipo ${classRef.name}.`,
    })
    declare data: T[];
  }

  // Nomeia a classe para o Swagger
  Object.defineProperty(ResponsePaginatorHost, 'name', {
    value: `Paginated${classRef.name}Dto`,
  });

  return ResponsePaginatorHost;
}