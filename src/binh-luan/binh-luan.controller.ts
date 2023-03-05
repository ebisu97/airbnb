import { BinhLuanService } from './binh-luan.service';
import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { TokenService } from 'src/token/token.service';
import { Token } from 'src/token/dto/token.dto';
import { AccessToken } from 'src/token/dto/accessToken.dto';
import { BinhLuanViewModel } from './dto/binhluan.dto';

@ApiTags("BinhLuan")
@Controller('/api')
export class BinhLuanController {
    constructor (
        private binhLuanService: BinhLuanService,
        private tokenService: TokenService,
    ) { }

    //lấy danh sách bình luận
    @Get("/binh-luan")
    async getDanhSachBinhLuan(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.binhLuanService.getDanhSachBinhLuan()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //tạo bình luận mới
    @HttpCode(201)
    @Post("/binh-luan")
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    async binhLuanMoi(@Body() body: BinhLuanViewModel, @Headers() headers: Token, @Headers() token: AccessToken): Promise<any> {

        let checkAccess = await this.tokenService.checkAccessToken(token)

        if (checkAccess.check === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { id, ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan } = body;
                const date = new Date(ngay_binh_luan);
                return this.binhLuanService.binhLuanMoi(
                    id, ma_phong, ma_nguoi_binh_luan, date, noi_dung, sao_binh_luan)
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkAccess.data
        }
    }

    //cập nhật bình luận
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Put("/binh-luan/:id")
    async chinhSuaBinhLuan(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number, @Body() body: BinhLuanViewModel): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        // check access token
        if (checkData.check === true) {
            let data = await this.tokenService.checkToken(headers);
            // check token
            if (data === true) {
                const { ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan } = body;
                const date = new Date(ngay_binh_luan);
                return this.binhLuanService.chinhSuaBinhLuan(
                    Number(idParam), ma_phong, ma_nguoi_binh_luan, date, noi_dung, sao_binh_luan)
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }
    }

    //xóa bình luận
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Delete("/binh-luan/:id")
    async xoaBinhLuan(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id    
                let checkAuth = await this.binhLuanService.kiemTraQuyenChinhBinhLuan(Number(userRole))
                if (checkAuth === true) {
                    return this.binhLuanService.xoaBinhLuan(
                        Number(idParam))
                } else {
                    return checkAuth.data
                }
            }
            else {
                return this.tokenService.checkToken(headers)
            }
        }
        else {
            return checkData.data
        }
    }
    //lấy bình luận theo mã phòng
    @Get("/binh-luan/lay-binh-luan-theo-phong/:MaPhong")
    async getBinhLuanTheoIdPhong(@Headers() headers: Token, @Param("MaPhong") maPhong: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.binhLuanService.getBinhLuanTheoIdPhong(
                Number(maPhong))
        } else {
            return this.tokenService.checkToken(headers)
        }
    }
}
