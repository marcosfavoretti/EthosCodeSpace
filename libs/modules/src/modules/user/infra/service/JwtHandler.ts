import { jwtWrapper } from '@app/modules/utils/jwt.wrapper';
import { User } from '../../@core/entities/User.entity';


export class JwtHandler {
    private secretKey: string;
    private expiresIn: number;

    constructor() {
        this.secretKey = String(process.env.SECRET);
        this.expiresIn = Number(process.env.EXPIREHOURS);
    }

    checkToken(token: string): boolean {
        try {
            jwtWrapper().verify(token, this.secretKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    decodeToken(token: string): unknown {
        try {
            return jwtWrapper().decode(token);
        } catch (error) {
            return null;
        }
    }

    generateToken(user: User): string {
        const payload: Omit<User, 'password'> = {
            ...user
        }
        return jwtWrapper()
            .sign(
                payload,
                this.secretKey,
                { expiresIn: this.expiresIn }
            );
    }
}