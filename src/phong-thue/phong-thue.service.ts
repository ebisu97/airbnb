import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PhongThueService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //get danh sách phòng
    @HttpCode(200)
    async getDanhSachPhong(): Promise<any> {
        let data = await this.prisma.phong.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            message: "Lấy danh sách phòng thành công",
            content: data,
            dateTime: jsonDate
        }
    }

    //check quyền access phòng
    async kiemTraQuyenChinhRoom(id: number): Promise<any> {
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
    async themPhongMoi(id: number, ten_phong: string, khach: number, phong_ngu: number, giuong: number, phong_tam: number, mo_ta: string, gia_tien: number, may_giat: boolean, ban_la: boolean, tivi: boolean, dieu_hoa: boolean, wifi: boolean, bep: boolean, do_xe: boolean, ho_boi: boolean, ban_ui: boolean, hinh_anh: string, ma_vi_tri: number): Promise<any> {
        // tạo phòng mới
        await this.prisma.phong.create({
            data: {
                ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri
            }
        })
        let newRoom = await this.prisma.phong.findFirst({
            where: {
                ten_phong
            },
            orderBy: {
                id: 'desc'
            }
        })
        let jsonDate = (new Date()).toJSON();
        // thêm phòng mới
        return {
            statusCode: 201,
            message: "Thêm phòng mới thành công",
            content: {
                id: newRoom.id,
                ten_phong,
                khach,
                phong_ngu,
                giuong,
                phong_tam,
                mo_ta,
                gia_tien,
                may_giat,
                ban_la,
                tivi,
                dieu_hoa,
                wifi,
                bep,
                do_xe,
                ho_boi,
                ban_ui,
                hinh_anh,
                ma_vi_tri
            },
            dateTime: jsonDate
        }
    }

    //lấy danh sách phòng theo vị trí
    async getPhongTheoViTri(maViTri: number): Promise<any> {
        // findmany theo phòng trùng mã vị trí được truyền
        let data = await this.prisma.phong.findMany({
            where: {
                ma_vi_tri: maViTri
            }
        })
        // tìm chính xác vị trí được truyền
        let kiemTraViTriDanhSach = await this.prisma.viTri.findFirst({
            where: {
                id: maViTri
            }
        })
        let jsonDate = (new Date()).toJSON();
        // tìm dựa trên dữ liệu được truyền vào, nếu có dữ liệu và có vị trí thì trả dữ liệu
        if (data.length > 0 && kiemTraViTriDanhSach !== null) {
            return {
                statusCode: 200,
                message: "Lấy thông tin thành công",
                content: data,
                dateTime: jsonDate
            }
        }
        // nếu dữ liệu = 0 và có dữ liệu vị trí thì not found
        if (data.length === 0 && kiemTraViTriDanhSach !== null) {
            throw new HttpException({
                statusCode: 400,
                message: "Mã vị trí chưa đặt phòng",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
        else {
            throw new HttpException({
                statusCode: 404,
                message: "Mã vị trí hoặc phòng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }

    }

    //lấy danh sách theo trang
    async getDanhSachPhongTheoTrang(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            // nếu số trang khác 0 và phần tử cho một trang lớn hơn 0
            if (pageIndex !== 0 && pageSize !== 0 && pageSize > 0 && pageIndex > 0) {
                //nếu từ khóa không tìm được thì trả về hết
                if (keyWord === undefined) {
                    let totalRow = await this.prisma.phong.count({
                    })
                    let data = await this.prisma.phong.findMany({
                        skip: (pageIndex - 1) * pageSize,
                        take: pageSize,
                        orderBy: { id: 'asc' }
                    })
                    return {
                        statusCode: 200,
                        message: "Lấy thông tin thành công",
                        content: {
                            pageIndex,
                            pageSize,
                            totalRow,
                            keyWord,
                            data
                        },
                        dateTime: jsonDate
                    }
                    // nếu có từ khóa thì tìm theo tên phòng hoặc mô tả
                } else {
                    let totalRow = await this.prisma.phong.count({
                        where: {
                            OR: [
                                {
                                    mo_ta: {
                                        contains: keyWord
                                    },
                                },
                                {
                                    ten_phong: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
                    let data = await this.prisma.phong.findMany({
                        orderBy: { id: 'asc' },
                        where: {
                            OR: [
                                {
                                    mo_ta: {
                                        contains: keyWord
                                    },
                                },

                                {
                                    ten_phong: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
                    // nếu có dữ liệu thì trả dữ liệu
                    if (data.length > 0) {
                        return {
                            statusCode: 200,
                            message: "Lấy thông tin thành công",
                            content: {
                                pageIndex,
                                pageSize,
                                totalRow,
                                keyWord,
                                data
                            },
                            dateTime: jsonDate
                        }
                    // nếu không có kết quả thì trả về theo mặc định 202
                    } else {
                        return {
                            statusCode: 202,
                            message: "Không tìm thấy kết quả từ khóa",
                            content: {
                                pageIndex,
                                pageSize,
                                totalRow,
                                keyWord,
                                data
                            },
                            dateTime: jsonDate
                        }
                    }
                }
            } else {
                throw new HttpException({
                    statusCode: 400,
                    message: "Yêu cầu không hợp lệ",
                    content: "Không có số trang và số phần tử mỗi trang và phải lớn hơn 0",
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        } catch {
            throw new HttpException({
                statusCode: 404,
                message: "Yêu cầu không hợp lệ",
                content: "Số trang và số phần tử phải lớn 0",
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
    }

    //lấy danh sách phòng theo id
    async layPhongTheoId(id: number): Promise<any> {
        // tìm id theo danh sách phòng
        let checkId = await this.prisma.phong.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        // nếu null thì not found
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã phòng không tồn tại!",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        //nếu không null thì trả id theo đúng phòng
        } else {
            let data = await this.prisma.phong.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin phòng thành công",
                content: data,
                dateTime: jsonDate
            }
        }
    }

    //chỉnh sửa thông tin phòng theo id
    @HttpCode(200)
    async chinhSuaThongTinPhong(id: number, idParam: number, ten_phong: string, khach: number, phong_ngu: number, giuong: number, phong_tam: number, mo_ta: string, gia_tien: number, may_giat: boolean, ban_la: boolean, tivi: boolean, dieu_hoa: boolean, wifi: boolean, bep: boolean, do_xe: boolean, ho_boi: boolean, ban_ui: boolean, hinh_anh: string, ma_vi_tri: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        let checkId = await this.prisma.phong.findFirst({
            where: {
                id: idParam
            }
        })
        if (checkId === null) {
            throw new HttpException({
                statusCode: 403,
                message: "Mã phòng không tồn tại!",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        } else {
            await this.prisma.phong.update({
                data: {
                    ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateUser = await this.prisma.phong.findFirst({
                where: { id: idParam }
            })

            return {
                statusCode: 200,
                message: "Chỉnh sửa thành công",
                content: updateUser,
                dateTime: jsonDate
            }
        }
    }


    //xóa phòng
    async xoaPhong(idDelete: number): Promise<any> {
        // check id truyền vào khớp với id cần xóa
        let checkIdPhong = await this.prisma.phong.findFirst({
            where: {
                id: idDelete
            }
        })
        let jsonDate = (new Date()).toJSON();
        try {
            // nếu khớp thì xóa
            if (checkIdPhong.id !== null) {
                await this.prisma.phong.delete({
                    where: {
                        id: idDelete
                    }
                })
                // trả kết quả 200
                return {
                    data: {
                        statusCode: 200,
                        message: "Xóa phòng thành công",
                        content: null,
                        dateTime: jsonDate
                    }
                }
                // còn không thì false 404
            } else {
                return false
            }
        } catch (err) {
            if (checkIdPhong === null) {
                throw new HttpException({
                    statusCode: 404,
                    message: "Mã phòng không tồn tại",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.NOT_FOUND)
            }
            let checkBinhLuanCoTrongPhong = await this.prisma.binhLuan.findMany({
                where: { ma_phong: idDelete }
            })
            let checkIdNguoiDungDaDatPhong = await this.prisma.datPhong.findMany({
                where: { ma_phong: idDelete }
            })
            console.log("comment",checkBinhLuanCoTrongPhong)
            console.log("room",checkIdNguoiDungDaDatPhong)
            if (checkBinhLuanCoTrongPhong.length >0) {
                throw new HttpException({
                    statusCode: 403,
                    message: "Mã phòng không xóa được vì đã có người bình luận",
                    data: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
    
            if (checkIdNguoiDungDaDatPhong.length >0) {
                throw new HttpException({
                    statusCode: 403,
                    message: "Mã phòng không xóa được vì đã có người đặt phòng",
                    data: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
            else {
                throw new HttpException({
                    statusCode: 400,
                    message: "Xóa thất bại",
                    data: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        }

    }

    //Upload hình phòng
    async uploadHinhPhong(maPhong: number, filename: string): Promise<any> {
        await this.prisma.phong.update({
            data: { hinh_anh: filename },
            where: {
                id: maPhong
            }
        })
        let jsonDate = (new Date()).toJSON();
        return {
            statusCode: 201,
            message: "Cập nhật ảnh thành công",
            content: filename,
            dateTime: jsonDate
        }
    }
}
