declare module "jsonwebtoken" {
  export interface SignOptions {
    expiresIn?: string | number;
  }

  export type Secret = string | Buffer;
  export type JwtPayload = string | Record<string, unknown>;

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: Secret,
  ): JwtPayload;

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
  };

  export default jwt;
}
