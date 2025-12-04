import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Module({
  providers: [
    {
      provide: 'NODEMAILER_TRANSPORTER',
      useFactory: async (configService: ConfigService) => {
        Logger.debug('Tentar conexão com o email')
        const emailConfig = {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false, // or configService.get<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
          tls: {
            ciphers: 'SSLv3',
          },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
        }
        const connection = await nodemailer.createTransport(emailConfig);

        try {
          await connection.verify();
          Logger.debug('Server is ready to take our messages');
        } catch (error) {
          Logger.error('Failed to connect to email server.', error.stack);
          throw new Error('Failed to connect to email server.');
        }

        connection.on('error', (err) => {
          Logger.error('Nodemailer connection error occurred.', err.stack);
        });

        return connection;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['NODEMAILER_TRANSPORTER'],
})
export class NodemailerProviderModule { }
