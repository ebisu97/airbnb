import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';

import { PrismaClient } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //Đăng Ký
    @HttpCode(200)
    async signup(name: string, email: string, pass_word: string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        // check email xem đã tồn tại chưa
        let newUser = await this.prisma.nguoiDung.findFirst({
            where: {
                email: email
            }
        })
        // nếu tồn tại thì không hợp lệ
        if (newUser) {
            let jsonDate = (new Date()).toJSON();
            throw new HttpException({
                statusCode: 400,
                message: "Yêu cầu không hợp lệ",
                content: "Email đã tồn tại",
                dateTime: jsonDate,
            },HttpStatus.BAD_REQUEST)
        // xác nhận false thì tạo mới
        } else {
            await this.prisma.nguoiDung.create({
                data: {
                    name, email, pass_word, phone, birth_day, gender, role
                }
            })

            let createdUser = await this.prisma.nguoiDung.findFirst({
                where: {
                    email: email
                }
            })
            return {
                "message": "Sign up success",
                "statusCode": 201,
                "content": {
                    id: createdUser.id,
                    name,
                    email,
                    pass_word,
                    phone,
                    birth_day,
                    gender,
                    role
                },
                "dateTime":jsonDate
            }
        }
    }
    //Đăng nhập
    @HttpCode(201)
    async signin(email: string, pass_word: string): Promise<any> {
        let checkEmail = await this.prisma.nguoiDung.findFirst({
            where: {
                email
            }
        })
        if (checkEmail) {
            //check nếu email true thì xét tới password, nếu đúng thì generate token
            if (checkEmail.pass_word == pass_word) {
                let token = this.jwt.sign(checkEmail, {
                    expiresIn: "30d",
                    secret: this.config.get("SECRET_KEY")
                });
                let jsonDate = (new Date()).toJSON();
                return {
                    check: true,
                    token: token,
                    user: checkEmail,
                    jsonDate,
                };
            // nếu sai pass thì trả data
            } else {
                return {
                    check: false,
                    data: "Mật khẩu không hợp lệ. Xin vui lòng thử lại"
                }
            }
            //email sai
        } else {
            return {
                data: "Email không hợp lệ"
            };
        }
    }
}
