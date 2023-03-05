import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatPhongService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }
    private prisma = new PrismaClient();

    //lấy danh sách phòng
    @HttpCode(200)
    async getDanhSachDatPhong(): Promise<any> {
        let data = await this.prisma.datPhong.findMany();
        let jsonDate = (new Date()).toJSON();
        return {
            statusCode: 200,
            message: "Lấy thông tin thành công",
            content: data,
            dateTime: jsonDate
        }
    }

    //lấy danh sách đặt phòng theo id phòng
    async getThongTinDatPhongTheoId(id: number): Promise<any> {
        let checkId = await this.prisma.datPhong.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        // nếu null là không tìm thấy thông tin phòng
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã đặt phòng không tồn tại",
                content:null,
                dateTime: jsonDate
            },HttpStatus.NOT_FOUND)
        // nếu có thì tiếp tục tìm theo id và trả ra 200
        } else {
            let data = await this.prisma.datPhong.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin đặt phòng thành công",
                content: data,
                dateTime: jsonDate
            }
        }
    }

    //check quyền đặt phòng
    async kiemTraQuyenDatRoom(id: number): Promise<any> {
        let checkData = await this.prisma.nguoiDung.findFirst({
            where: {
                id
            }
        })
        if (checkData.role === "Admin" || checkData.role === "admin" || checkData.role === "ADMIN"){
            return true
        }
        else {
            let jsonDate = (new Date()).toJSON();
            return {
                data: {
                    statusCode: 403,
                    content: "User không có quyền admin",
                    dateTime: jsonDate
                }
            }
        }
    }

    // thêm phòng mới
    async themDatPhongMoi(id: number, ma_phong: number, dateArrive: any, dateLeave: any, so_luong_khach: number, ma_nguoi_dat: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            let kiemTraTheoRoomId = await this.kiemTraTheoRoomId(ma_phong)
            let kiemTraMaUserId = await this.kiemTraMaUserId(ma_nguoi_dat)
            // nếu cả hai thông tin đều có trên hệ thống thì cho tạo đặt phòng phòng
            if (kiemTraTheoRoomId && kiemTraMaUserId) {
                await this.prisma.datPhong.create({
                    data: {
                        ma_phong, ngay_den: dateArrive, ngay_di: dateLeave, so_luong_khach, ma_nguoi_dat
                    }
                })
                // tạo new booking và sắp xếp giảm dần
                let newBooking = await this.prisma.datPhong.findFirst({
                    where: {
                        ma_phong
                    },
                    orderBy: {
                        id: 'desc'
                    }
                })
                return {
                    statusCode: 201,
                    message: "Thêm đặt phòng mới thành công",
                    content: {
                        id: newBooking.id,
                        ma_phong,
                        ngay_den: dateArrive,
                        ngay_di: dateLeave,
                        so_luong_khach,
                        ma_nguoi_dat,
                    },
                    dateTime: jsonDate
                }
            } else {
                return false
            }
        } catch {
            throw new HttpException({
                statusCode: 404,
                message: "Không tìm thấy thông tin phòng hoặc người dùng",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
    }

    //chỉnh thông tin đặt phòng
    @HttpCode(200)
    async editThongTinDatPhong(idParam: number, id: number, ma_phong: number, dateArrive: any, dateLeave: any, so_luong_khach: number, ma_nguoi_dat: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        let kiemTraTheoMaBooking = await this.kiemTraTheoMaBooking(idParam)
        let kiemTraMaUserId = await this.kiemTraMaUserId(ma_nguoi_dat)
        let kiemTraTheoRoomId = await this.kiemTraTheoRoomId(ma_phong);
        // nếu cả 3 thông tin đúng, mã đặt phòng bên trên có trong hệ thống, có id user trong hệ thống và có room theo hệ thống thì cho sứa qua lệnh update
        if (kiemTraTheoMaBooking.check === true && kiemTraMaUserId.check === true && kiemTraTheoRoomId.check === true) {
            await this.prisma.datPhong.update({
                data: {
                    ma_phong, ngay_den: dateArrive, ngay_di: dateLeave, so_luong_khach, ma_nguoi_dat
                },
                where: {
                    id: Number(idParam)
                }
            })
            // update phòng
            let updateDatPhong = await this.prisma.datPhong.findFirst({
                where: {
                    id: idParam
                }
            })
            // chỉnh thành công
            return {
                statusCode: 201,
                message: "Chỉnh sửa thành công",
                content: updateDatPhong,
                dateTime: jsonDate
            }
        }
        // nếu kết quả mã booking không có hoặc null thì không tồn tại
        if (!kiemTraTheoMaBooking.check) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã đặt phòng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        // nếu mã user không có trong danh sách thì không tồn tại
        if (!kiemTraMaUserId.check) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        // nếu room không tồn tại trong danh sách
        if (!kiemTraTheoRoomId.check) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã phòng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        // còn lại lỗi các mã đã truyền
        } else {
            throw new HttpException({
                statusCode: 404,
                message: "Vui lòng kiểm tra lại các mã đã truyền",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
    }

    //kiểm tra mã người dùng có trong hệ thống, nếu có thì true, không thì false
    async kiemTraMaUserId(ma_nguoi_dat: number,): Promise<any> {
        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: ma_nguoi_dat
            }
        })
        if (checkId === null) {
            return {
                check: false,
            }
        } else {
            return {
                check: true,
            }
        }
    }

    //kiểm tra mã đặt phòng nếu có thì cho đặt, không thì false
    async kiemTraTheoMaBooking(ma_dat_phong: number): Promise<any> {
        let checkId = await this.prisma.datPhong.findFirst({
            where: {
                id: ma_dat_phong
            }
        })
        if (checkId === null) {
            return {
                check: false,
            }
        } else {
            return {
                check: true,
            }
        }
    }

    //kiểm tra mã phòng nếu có thì cho đặt, không thì false
    async kiemTraTheoRoomId(ma_phong: number): Promise<any> {
        let checkId = await this.prisma.phong.findFirst({
            where: {
                id: ma_phong
            }
        })
        if (checkId === null) {
            return {
                check: false,
            }
        } else {
            return {
                check: true,
            }
        }
    }

    //lấy danh sách theo user
    async getDatPhongTheoUserId(maNguoiDung: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        let kiemTraMaUserId = await this.kiemTraMaUserId(maNguoiDung);
        // nếu như kiểm tra có thì true
        if (kiemTraMaUserId.check === true) {
            let data = await this.prisma.datPhong.findMany({
                where: {
                    ma_nguoi_dat: maNguoiDung
                },
                orderBy: {
                    id: "desc"
                }
            })
            // nếu có dữ liệu thì lấy thông tin thành công
            if (data.length !== 0 && data.length > 0) {
                return {
                    statusCode: 200,
                    message: "Lấy thông tin thành công",
                    content: data,
                    dateTime: jsonDate
                }
            // còn lại là lỗi không tìm ra hoặc chưa đặt
            } else {
                throw new HttpException({
                    statusCode: 400,
                    message: "Người dùng chưa đặt phòng",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
            // không tồn tại
        } else {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
    }

    //xóa thông tin đặt phòng
    async xoaDatPhong(idDelete: number): Promise<any> {
        // kiểm tra mã
        let kiemTraTheoMaBooking = await this.kiemTraTheoMaBooking(idDelete);
        let jsonDate = (new Date()).toJSON();
        // nếu là true thì xóa
        if (kiemTraTheoMaBooking.check) {
            await this.prisma.datPhong.delete({
                where: {
                    id: idDelete
                }
            })
            return {
                data: {
                    statusCode: 201,
                    message: "Xóa thông tin đặt phòng thành công",
                    content: null,
                    dateTime: jsonDate
                }
            }
            // còn false thì báo lỗi 404
        } else {
            throw new HttpException({
                statusCode: 404,
                message: "Mã đặt phòng này đã xóa hoặc chưa từng tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
    }
}
