import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token } from './dto/token.dto';
import { AccessToken } from './dto/accessToken.dto';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async checkToken(token: Token): Promise<any> {
        // decode token dò HetHanTime
        let data: any = this.jwt.decode(token.tokencybersoft);
        let dNow: Date = new Date();
        if (data !== null) {
            let dToken: Date = new Date(Number(data.HetHanTime));
            // nếu token cybersoft hết hạn thì false, còn hạn thì ok
            if (dNow > dToken)
                return false
            else {
                return true
            }
        } else {
            let jsonDate = (new Date()).toJSON();
            throw new HttpException({
                statusCode: 403,
                message: "Người dùng không có quyền truy cập",
                content: "Token Cybersoft không hợp lệ hoặc hết thời hạn",
                dateTime: jsonDate,
            }, HttpStatus.FORBIDDEN)
        }
    }
    // login token access
    async checkAccessToken(accessToken: AccessToken): Promise<any> {
        try {
            if (accessToken.token === undefined) {
                let jsonDate = (new Date()).toJSON();
                return {
                    check: true,
                    logInfo: false,
                    data: {
                        statusCode: 403,
                        content: "Token đã hết hạn hoặc không đúng",
                        dateTime: jsonDate
                    }
                }
            } else {
                await this.jwt.verify(accessToken.token, this.config.get("SECRET_KEY"))
                return {
                    check: true,
                    logInfo: true,
                    info: this.jwt.verify(accessToken.token, this.config.get("SECRET_KEY"))
                }
            }
        } catch (err) {
            let jsonDate = (new Date()).toJSON();
            console.log("checktokenaccess", accessToken.token)
            throw new HttpException({
                statusCode: 403,
                message: "Người dùng không có quyền truy cập",
                content: "token user hết hạn hoặc  đúng",
                dateTime: jsonDate,
            }, HttpStatus.FORBIDDEN)
        }
    }


}
