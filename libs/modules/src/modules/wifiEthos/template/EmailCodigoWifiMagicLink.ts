import { ethos_logox64 } from "@app/modules/utils/ethos_logox64";

export interface MagicLinkEmailProps {
    employeeName: string; 
    magicLink: string;    
}

export const EmailMagicLinkTemplate = (props: MagicLinkEmailProps) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitação Wi-Fi</title>
    <style>
        /* Reset básico */
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; }
        
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

        /* Cabeçalho - AGORA IDÊNTICO AO PRIMEIRO TEMPLATE */
        .header {
            background-color: #b2b9b8;
            padding: 30px;
            text-align: center;
        }
        /* REMOVIDO O CSS ESPECÍFICO PARA .header img QUE CAUSAVA A DIFERENÇA */

        .header h1 {
            color: #ffffff;
            margin: 0; /* Mantido 0 para ficar igual ao outro */
            font-size: 24px;
            font-weight: 600;
            /* Adicionado um pequeno espaço superior caso o logo cole muito no título */
            margin-top: 15px; 
        }

        /* Conteúdo */
        .content { padding: 40px 30px; color: #51545e; text-align: center; }
        .greeting { font-size: 18px; margin-bottom: 20px; text-align: left; }
        .message { line-height: 1.6; margin-bottom: 25px; text-align: left; }

        /* Botão de Ação */
        .btn {
            display: inline-block;
            background-color: #2c3e50;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .btn:hover { background-color: #1a252f; }

        /* Link Alternativo */
        .link-box {
            background-color: #f8f9fa;
            border: 1px dashed #cbd5e0;
            border-radius: 6px;
            padding: 15px;
            margin-top: 30px;
            text-align: center;
        }
        .link-text {
            font-size: 12px;
            color: #718096;
            word-break: break-all;
            display: block;
            margin-top: 5px;
        }

        /* Rodapé */
        .footer {
            background-color: #f4f4f7;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #a0aec0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${ethos_logox64}" alt="Ethos Logo" />
            <h1>Solicitação de Acesso</h1>
        </div>

        <div class="content">
            <div class="greeting">Olá, <strong>${props.employeeName}</strong>!</div>
            
            <p class="message">
                Recebemos sua solicitação para criar um acesso à rede Wi-Fi de visitantes.
                Para continuar e cadastrar os dados do visitante, clique no botão abaixo:
            </p>

            <a href="${props.magicLink}" class="btn">
                Gerar Código de Acesso
            </a>

            <div class="link-box">
                <span style="font-size: 12px; font-weight: bold; color: #718096;">O botão não funcionou?</span>
                <span style="font-size: 12px; color: #718096;">Copie e cole o link abaixo no seu navegador:</span>
                <a href="${props.magicLink}" class="link-text">${props.magicLink}</a>
            </div>
            
             <p class="message" style="margin-top: 20px; font-size: 14px; color: #a0aec0;">
                Este link é válido por tempo limitado por motivos de segurança.
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