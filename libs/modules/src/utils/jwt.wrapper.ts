import * as jwt from 'jsonwebtoken';

// 1. Importe os tipos que vamos usar da biblioteca
import { 
    JwtPayload, 
    SignOptions, 
    VerifyOptions, 
    DecodeOptions 
} from 'jsonwebtoken';

export function jwtWrapper() {

    /**
     * Verifica um token JWT usando um segredo ou chave pública.
     * * @param token O string do token a ser verificado.
     * @param secretOrPublicKey O segredo (para HS256) ou chave pública (para RS256)
     * @param options Opções de verificação (ex: { algorithms: ['RS256'] })
     * @returns O payload (conteúdo) do token se for válido.
     * @throws Lança um erro (ex: JsonWebTokenError, TokenExpiredError) se o token for inválido.
     */
    function verify(token: string, secretOrPublicKey: string, options?: VerifyOptions): string | JwtPayload {
        // CORREÇÃO: O retorno não é 'boolean'. 
        // É o payload se der certo, ou um erro se der errado.
        return jwt.verify(token, secretOrPublicKey, options) as string | JwtPayload;
    }

    /**
     * Cria (assina) um novo token JWT.
     * * @param payload O conteúdo que você quer guardar no token (ex: { userId: 1 })
     * @param secretOrPrivateKey O segredo ou chave privada para assinar.
     * @param options Opções de assinatura (ex: { expiresIn: '1h' })
     * @returns O string do token JWT.
     */
    function sign(payload: object | string | Buffer, secretOrPrivateKey: string, options?: SignOptions): string {
        // CORREÇÃO: Trocamos { expiresIn: string } por SignOptions
        // 'SignOptions' é o tipo oficial da biblioteca, que inclui 'expiresIn', 'issuer', etc.
        return jwt.sign(payload, secretOrPrivateKey, options);
    }

    /**
     * Decodifica o token e retorna o payload *sem verificar a assinatura*.
     * * @param token O string do token.
     * @param options Opções de decodificação.
     * @returns O payload decodificado ou `null` se for um token mal formatado.
     */
    function decode(token: string, options?: DecodeOptions): null | string | JwtPayload {
        // CORREÇÃO: O retorno não pode ser um genérico 'T'.
        // A função retorna o payload ou 'null' se não conseguir nem ler o token.
        return jwt.decode(token, options) as null | string | JwtPayload;
    }

    // Retorna o objeto com as funções corretamente tipadas
    return {
        verify,
        decode,
        sign
    };
}