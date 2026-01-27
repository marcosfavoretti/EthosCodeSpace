import { Request } from 'express';
import { IncomingMessage } from 'http';

export function cookiesExtractor(req: Request): Record<string, string> | null {
  let headers: IncomingMessage['headers'];
  if ('headers' in req) {
    headers = req.headers;
  } else {
    return null;
  }
  const cookieHeader = headers?.cookie;
  if (!cookieHeader) {
    return null;
  }
  const cookiesObject = cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split('=').map((part) => part.trim());
      if (key && value) acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );
  return cookiesObject;
}

export function cookiesExtractorByString(cookies: string[]): Record<string, string> {
  // 1. Proteção contra input nulo ou indefinido
  if (!cookies || !Array.isArray(cookies)) {
    return {};
  }

  return cookies.reduce((accumulator, cookieString) => {
    // Pega apenas a parte "chave=valor", ignorando "Path", "Secure", etc.
    const cookieRaw = cookieString.split(';')[0];

    // 2. Usa indexOf em vez de split para garantir que valores contendo '=' não quebrem
    const separatorIndex = cookieRaw.indexOf('=');

    // Se não tiver '=', ignora essa entrada
    if (separatorIndex === -1) return accumulator;

    // Separa a chave e o valor com precisão
    const key = cookieRaw.substring(0, separatorIndex).trim();
    let value = cookieRaw.substring(separatorIndex + 1).trim();

    // 3. Decodifica o valor (opcional, mas recomendado)
    try {
      value = decodeURIComponent(value);
    } catch (e) {
      // Se falhar o decode, mantém o valor original
    }

    if (key) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {} as Record<string, string>);
}