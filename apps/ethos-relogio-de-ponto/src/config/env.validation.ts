import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // HTTP/Node
  HOST: Joi.string().optional().allow(''), // Opcional, e pode ser uma string vazia
  PORT: Joi.number().port().required(), // Deve ser um número de porta válido
  NODE_TLS_REJECT_UNAUTHORIZED: Joi.number().valid(0, 1).default(1), // Deve ser 0 ou 1, com padrão 1 (seguro)

  // Configurações do Relógio de Ponto
  RELOGIO_ENDPOINTS: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      try {
        const urls = value.split(',');
        // Validação extra: verifica se são URLs válidas
        for (const url of urls) {
          new URL(url); // Se a URL for inválida, isso lançará um erro
        }
        return urls; // Retorna o array de URLs
      } catch (error) {
        return helpers.error('string.uri', { value, error: error.message });
      }
    }),
  RELOGIO_SENHA: Joi.string().required(),
  RELOGIO_LOGIN: Joi.string().required(),

  // Configurações do RabbitMQ
  RABBITHOST: Joi.string().required(), // Pode ser IP ou hostname
  RABBITPORT: Joi.number().port().required(), // Joi converte a string "5672" para número
  RABBITUSER: Joi.string().required(),
  RABBITPASSWORD: Joi.string().required(),
  RABBITMQ_URL: Joi.string()
    .uri({
      scheme: [
        'amqp', // Garante que o protocolo seja 'amqp'
      ],
    })
    .required(),

  // Configurações de Armazenamento
  LOCAL_STORAGE_PATH: Joi.string().required(),
});
