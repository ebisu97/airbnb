import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Token } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { DatPhongService } from './dat-phong.service';
import { DatPhongViewModel } from './dto/datPhong.dto';

@ApiTags("DatPhong")
@Controller('/api')
export class DatPhongController {

    constructor(
        private datPhongService: DatPhongService,
        private tokenService: TokenService
    ) { }

    //lấy danh sách đặt phòng
    @Get("/dat-phong")
    async getDanhSachDatPhong(@Headers() headers: Token): Promise<any> {
        let token = await this.tokenService.checkToken(headers);
        // nếu token true lấy danh sách
        if (token === true) {
            return this.datPhongService.getDanhSachDatPhong()
        } else {
            return this.tokenService.checkToken(headers)
        }
    }

    // tạo đặt phòng mới
    @Post("/dat-phong")
    async taoDatPhongMoi(@Body() body: DatPhongViewModel,@Headers() headers: Token): Promise<any> {
        let token = await this.tokenService.checkToken(headers);
        // nếu token true thì đặt phòng
        if (token === true) {
            const { id, ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = body;
            const ngayDen = new Date(ngay_den);
            const ngayDi = new Date(ngay_di);
            return this.datPhongService.themDatPhongMoi(id, ma_phong, ngayDen, ngayDi, so_luong_khach, ma_nguoi_dat)
            // false thì trả token
        } else {
            return this.tokenService.checkToken(headers)
        }
    }

    //lấy thông tin đặt phòng theo id phòng
    @Get("/dat-phong/:id")
    async getThongTinDatPhongTheoId(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        //true thì tìm theo id phòng
        if (data === true) {
            return this.datPhongService.getThongTinDatPhongTheoId(Number(id))
        } else {
            return data
        }
    }

    //edit thông tin đặt phòng
    @Put("/dat-phong/:id")
    async editThongTinDatPhong(@Headers() headers: Token, @Param("id") idParam: number, @Body() body: DatPhongViewModel): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        // true thì cập nhật từ body theo model
        if (data === true) {
            const { id, ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = body;
            const ngayDen = new Date(ngay_den);
            const ngayDi = new Date(ngay_di);
            return this.datPhongService.editThongTinDatPhong(
                Number(idParam), id, ma_phong, ngayDen, ngayDi, so_luong_khach, ma_nguoi_dat
            )
        } else {
            return this.tokenService.checkToken(headers)
        }
    }

    //xóa thông tin đặt phòng
    @Delete("/dat-phong/:id")
    async xoaDatPhong(@Headers() headers: Token, @Param("id") idParam: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        // token true thì dò theo user id
        if (data === true) {
            return this.datPhongService.xoaDatPhong(Number(idParam))
        } else {
            return this.tokenService.checkToken(headers);
        }
    }

    //lấy thông tin đặt phòng theo user id
    @Get("/phong-thue/lay-theo-nguoi-dung/:MaNguoiDung")
    async getDatPhongTheoUserId(@Headers() headers: Token, @Param("MaNguoiDung") maNguoiDung: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        // token đúng thì dò theo id user
        if (data === true) {
            return this.datPhongService.getDatPhongTheoUserId(Number(maNguoiDung))
        } else {
            return data
        }
    }
}
