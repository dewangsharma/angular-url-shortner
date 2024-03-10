export class AuthenticationRes {
    token: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
}