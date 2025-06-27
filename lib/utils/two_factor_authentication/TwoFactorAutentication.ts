export class TwoFactorAutentication {
    async generateToken({ secret }: { secret: string }): Promise<string> {
        const OTPAuth = await import('otpauth')
        return new OTPAuth.TOTP({
            secret,
        }).generate()
    }
}