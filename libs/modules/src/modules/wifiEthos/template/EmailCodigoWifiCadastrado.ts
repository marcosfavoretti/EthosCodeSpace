import { ethos_logox64 } from "@app/modules/utils/ethos_logox64";
import { WifiCodeManager } from "../@core/entities/WifiCodeManager.entity";

export const EmailCodigoWifiCadastradoTemplate = (wifiManager: WifiCodeManager, wifiSSID: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Acesso Wi-Fi</title>
    <style>
        /* Reset básico para clientes de email */
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; }
        table { border-collapse: collapse; width: 100%; }
        
        /* Container principal */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            margin-top: 20px;
            margin-bottom: 20px;
        }

        /* Cabeçalho */
        .header {
            background-color: #b2b9b8;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;

            font-size: 24px;
            font-weight: 600;
        }

        /* Conteúdo */
        .content { padding: 40px 30px; color: #51545e; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .message { line-height: 1.6; margin-bottom: 25px; }

        /* Box do Código */
        .code-box {
            background-color: #f8f9fa;
            border: 2px dashed #cbd5e0;
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .code-label {
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            color: #718096;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        .wifi-code {
            font-family: 'Courier New', Courier, monospace; /* Monoespaçada para legibilidade */
            font-size: 32px;
            font-weight: bold;
            color: #2d3748;
            letter-spacing: 2px;
            display: block;
        }

        /* Rodapé */
        .footer {
            background-color: #f4f4f7;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #a0aec0;
        }
        
        .info-table td { padding: 5px 0; }
        .label { font-weight: bold; color: #4a5568; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${ethos_logox64}" />
            <h1>Acesso Wi-Fi Liberado</h1>
        </div>

        <div class="content">
            <div class="greeting">Olá,</strong>!</div>
            
            <p class="message">
                Seu cadastro foi validado com sucesso. Abaixo está o seu código exclusivo para acessar a rede Wi-Fi de visitantes da <strong>Ethos</strong>.
            </p>

            <div class="code-box">
                <span class="code-label">Sua Senha de Acesso</span>
                <span class="wifi-code">${wifiManager.code}</span>
            </div>

            <p class="message">Detalhes do registro:</p>
            <table class="info-table">
             <tr>
                    <td class="label">Visitante:</td>
                    <td>${wifiManager.visitanteNome}</td>
                </tr>
                <tr>
                    <td class="label">Empresa:</td>
                    <td>${wifiManager.visitanteEmpresa}</td>
                </tr>
                <tr>
                    <td class="label">Host responsável:</td>
                    <td>${wifiManager.ethosEmail}</td>
                </tr>
                <tr>
                    <td class="label">Validade:</td>
                    <td>Válido por 2 dias</td>
                </tr>
            </table>

            <p style="margin-top: 30px; font-size: 14px; color: #718096;">
                Para conectar, selecione a rede <strong>${wifiSSID}</strong> e insira o código acima quando solicitado.
            </p>
        </div>

        <div class="footer">
            &copy; ${new Date().getFullYear()} Ethos. Todos os direitos reservados.<br>
            Este é um email automático, por favor não responda.
        </div>
    </div>
</body>
</html>
`;