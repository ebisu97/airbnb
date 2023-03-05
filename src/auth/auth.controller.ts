import { Controller } from '@nestjs/common';
import { HttpException, Post, HttpStatus } from '@nestjs/common';
import { Headers, UseGuards, Body, HttpCode } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt/dist';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { DangNhap } from './dto/signin.dto';
import { ThongTinNguoiDung } from './dto/signup.dto';
import { TokenService } from 'src/token/token.service';
import { Token } from './dto/token.dto';

@ApiTags("Auth")
@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwt: JwtService,
        private tokenService: TokenService,
    ) { }

    //đăng ký
    @HttpCode(201)
    @Post("/signup")
    @ApiBody({ type: ThongTinNguoiDung, required: true })
    // @UseGuards(AuthGuard("jwt"))
    public async signup(
        @Body() body: ThongTinNguoiDung,
        @Headers() headers: Token
    )
        : Promise<any> {
        let data = await this.tokenService.checkToken(headers)
        if (data == true) {
            const { name, email, pass_word, phone, birth_day, gender, role } = body;
            return this.authService.signup(name, email, pass_word, phone, birth_day, gender, role)
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }


    //Đăng nhập
    @ApiBody({ type: DangNhap, required: true })
    @Post("/signin")
    async signin(@Body() body: DangNhap, @Headers() headers: Token): Promise<any> {
        const { email, pass_word } = body;
        let data = await this.tokenService.checkToken(headers)
        if (data === true) {
            let checkLogin = await this.authService.signin(email, pass_word);

            if (checkLogin.check) {
                return {
                    statusCode: 200,
                    message: "Signin thành công",
                    content: {
                        user: checkLogin.user,
                        token: checkLogin.token
                    },
                    dateTime: checkLogin.jsonDate
                }
            }
            else {
                throw new HttpException({
                    statusCode:404,
                    message:checkLogin.data,
                }, HttpStatus.NOT_FOUND);
            }
        }
        else {
            return this.tokenService.checkToken(headers)
        }
    }

}

