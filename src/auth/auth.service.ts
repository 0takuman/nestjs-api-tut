import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService) {}

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique(
            {
                where: {
                    email: dto.email
                }
            }
        )

        if (!user) throw new ForbiddenException(
            'Credentials incorrect'
        )
        
        const pwMatches = await argon.verify(user.hash, dto.password)
        if (!pwMatches) throw new ForbiddenException(
            'Credentials incorrect'
        )

        delete user.hash
        return user
    }

    async signup(dto: AuthDto) {
        try {

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError 
                && error.code === 'P2002')
                throw new ForbiddenException (
                    'Credentials taken'
                )
            throw error
        }
        //gen pass hash
        const hash = await argon.hash(dto.password)

        //save new user to db
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            }
        })

        delete user.hash
        return user
    }
}