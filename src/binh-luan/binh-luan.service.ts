import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BinhLuanService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    // lấy danh sách bình luận
    @HttpCode(200)
    async getDanhSachBinhLuan(): Promise<any>{
        let data = await this.prisma.binhLuan.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            message: "Lấy danh sách bình luận thành công",
            content: data,
            dateTime: jsonDate
        }
    }

    //check quyền access chỉnh sửa bình luận
    async kiemTraQuyenChinhBinhLuan(id: number): Promise<any> {
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

    //kiểm tra phòng có trong hệ thống không
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

    //kiểm tra coi người dùng có trong danh sách không
    async kiemTraMaUserId(ma_user: number): Promise<any> {
        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: ma_user
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

    // tạo bình luận mới
    @HttpCode(201)
    async binhLuanMoi(id: number, ma_phong: number, ma_nguoi_binh_luan: number, date: any, noi_dung: string, sao_binh_luan: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            // kiểm tra room id và user, nếu đúng theo room hiện tại(và room có trong danh sách) và có id trong danh sách người dùng thì được post
            let kiemTraTheoRoomId = await this.kiemTraTheoRoomId(Number(ma_phong));
            let kiemTraMaUserId = await this.kiemTraMaUserId(Number(ma_nguoi_binh_luan));
            // check nếu cả 2 true thì thông qua
            if (kiemTraTheoRoomId && kiemTraMaUserId) {
                await this.prisma.binhLuan.create({
                    data: {
                        ma_phong, ma_nguoi_binh_luan, ngay_binh_luan: date, noi_dung, sao_binh_luan
                    }
                })
                let newPost = await this.prisma.binhLuan.findFirst({
                    where: {
                        ma_nguoi_binh_luan
                    },
                    distinct: ['ma_nguoi_binh_luan'],
                    orderBy: {
                        id: 'desc'
                    }
                })
                return {
                    statusCode: 201,
                    message: "Thêm mới bình luận thành công",
                    content: {
                        id: newPost.id,
                        ma_phong,
                        ma_nguoi_binh_luan,
                        ngay_binh_luan: date,
                        noi_dung,
                        sao_binh_luan
                    }
                }
            } else {
                return false
            }
        } catch {
            throw new HttpException({
                statusCode: 400,
                message: "Mã phòng hoặc mã người bình luận không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
    }

    //lấy bình luận theo id phòng
    async getBinhLuanTheoIdPhong(idPhong: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
            let kiemTraTheoRoomId = await this.kiemTraTheoRoomId(Number(idPhong))
            let data = await this.prisma.binhLuan.findMany({
                where: {
                    ma_phong:idPhong
                }
            })
            if (kiemTraTheoRoomId.check === true && data.length > 0) {
                return {
                    statusCode: 200,
                    message:"Lấy thông tin bình luận thành công",
                    content: data,
                    dateTime: jsonDate
                }
            }
            if(kiemTraTheoRoomId.check === true && data.length ===0){
                throw new HttpException({
                    statusCode: 404,
                    message: "Không tìm thấy người bình luận trong phòng này",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.NOT_FOUND)
            } else {
                throw new HttpException({
                    statusCode: 400,
                    message: "Không tồn tại phòng này, vui lòng thử mã khác",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
    }
    // xóa bình luận
    async xoaBinhLuan(idDelete: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            let checkIdComment = await this.prisma.binhLuan.findFirst({
                where: {
                    id: idDelete
                }
            })
            if (checkIdComment.id !== null) {
                await this.prisma.binhLuan.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    statusCode: 200,
                    message: "Xóa bình luận thành công",
                    content: null,
                    dateTime: jsonDate
                }
            } else {
                return false
            }
        } catch (err) {
            throw new HttpException({
                statusCode: 400,
                message: "Comment này đã xóa hoặc không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)

        }

    }

    //chỉnh sửa bình luận
    @HttpCode(200)
    async chinhSuaBinhLuan(idParam: number, ma_phong: number, ma_nguoi_binh_luan: number, date: any, noi_dung: string, sao_binh_luan: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            let kiemTraTheoRoomId = await this.kiemTraTheoRoomId(Number(ma_phong));
            let kiemTraMaUserId = await this.kiemTraMaUserId(Number(ma_nguoi_binh_luan));
            if (kiemTraTheoRoomId && kiemTraMaUserId) {
                await this.prisma.binhLuan.update({
                    data: { ma_phong, ma_nguoi_binh_luan, ngay_binh_luan: date, noi_dung, sao_binh_luan },
                    where: {
                        id: Number(idParam)
                    }
                })
                let capNhatThongTin = await this.prisma.binhLuan.findFirst({
                    where: { id: idParam }
                })
                return {
                    statusCode: 200,
                    message: "Chỉnh sửa thành công",
                    content: capNhatThongTin,
                    dateTime: jsonDate
                }
            }
            else {
                return false
            }
        }
        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Mã phòng hoặc mã người bình luận không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }

    }
}

