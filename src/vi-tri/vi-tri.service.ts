import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ViTriService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }
    private prisma = new PrismaClient();

    // lấy danh sách vị trí
    @HttpCode(200)
    async layDanhSachViTri(): Promise<any>{
        let data = await this.prisma.viTri.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            message: "Lấy thông tin vị trí thành công!",
            content: data,
            dateTime: jsonDate,
        }
    }

    // thêm vị trí mới
    @HttpCode(201)
    async themViTriMoi(id: number, ten_vi_tri: string, tinh_thanh: string, quoc_gia: string, hinh_anh: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        let kiemTraViTri = await this.prisma.viTri.findFirst({
            where: {
                ten_vi_tri
            }
        })
        // nếu có vị trí trùng thì trả về 400
        if (kiemTraViTri !== null) {
            return {
                statusCode: 400,
                message: "Trùng tên vị trí, vui lòng dùng tên vị trí khác",
                content: null,
                dateTime: jsonDate
            }
        }
        else {
            // nếu không có thì tạo
            await this.prisma.viTri.create({
                data: {
                    ten_vi_tri,tinh_thanh,quoc_gia,hinh_anh
                }
            })
            let newViTri = await this.prisma.viTri.findFirst({
                where: {
                    ten_vi_tri
                },
                orderBy:{
                    id: "desc"
                }
            })
            // đẩy data lên
            return {
                statusCode: 201,
                message: "Thêm vị trí mới thành công",
                content: {
                    id: newViTri.id,
                    ten_vi_tri,
                    tinh_thanh,
                    quoc_gia,
                    hinh_anh
                },
                dateTime: jsonDate,
            }
        }
    }

    // kiểm tra role của người dùng nếu admin thì ok còn user thì không được
    async checkAuthAccount(id: number): Promise<any> {
        let checkData = await this.prisma.nguoiDung.findFirst({
            where: {
                id
            }
        })

        if (checkData.role === "Admin" || checkData.role === "admin" || checkData.role === "ADMIN") {
            return true
        } else {
            let jsonDate = (new Date()).toJSON();
            return {
                data: {
                    statusCode: 401,
                    content: "Tài khoản này không có quyền",
                    dateTime: jsonDate
                }
            }
        }
    }

    // lấy vị trí theo trang
    async layViTriTheoTrang(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            // phải có số và lớn hơn 0
            if (pageIndex !== 0 && pageSize !== 0 && pageIndex > 0 && pageSize > 0){
                if (keyWord === undefined){
                    let totalRow = await this.prisma.viTri.count({})

                    let data = await this.prisma.viTri.findMany({
                        skip: (pageIndex - 1)* pageSize,
                        take: pageSize,
                        orderBy: { id: 'asc'}
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
                    // còn không thì tìm theo vị trí hoặc quốc gia
                } else {
                    let totalRow = await this.prisma.viTri.count({
                        where: {
                            OR: [
                                {
                                    ten_vi_tri: {
                                        contains: keyWord
                                    },
                                },
                                {
                                    quoc_gia: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
                    let data = await this.prisma.viTri.findMany({
                        orderBy: { id: 'asc' },
                        where: {
                            OR: [
                                {
                                    ten_vi_tri: {
                                        contains: keyWord
                                    },
                                },

                                {
                                    quoc_gia: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
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
                    } else {
                        return {
                            statusCode: 404,
                            message: "Không tìm thấy kết quả",
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
            }
            else {
                throw new HttpException({
                    statusCode: 400,
                    message: "Yêu cầu không hợp lệ",
                    content: "Số trang và số phần tử phải lớn 0",
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        }
        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Yêu cầu không hợp lệ",
                content: "Số trang và số phần tử phải lớn 0",
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
    }

    // lấy vị trí theo id vị trí
    async danhSachViTriTheoId(id: number): Promise<any> {
        let checkId = await this.prisma.viTri.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        // nếu id ra null thì không tồn tại
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã vị trí không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        // còn tồn tại thì dò theo id
        else {
            let data = await this.prisma.viTri.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }

    // update theo vị trí
    @HttpCode(200)
    async editThongTinViTri(idParam: number, id: number, ten_vi_tri: string, tinh_thanh: string, quoc_gia: string, hinh_anh: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        // kiểm tra id theo param
        let checkId = await this.prisma.viTri.findFirst({
            where: {
                id: idParam
            }
        })
        // nếu param bằng null
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã vị trí không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        // còn nếu có kết quả thì update thông tin mới
        } else {
            await this.prisma.viTri.update({
                data: {
                    ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh
                },
                where: {
                    id: Number(idParam)
                }
            })
            let capNhatViTri = await this.prisma.viTri.findFirst({
                where: { id: idParam }
            })

            return {
                statusCode: 201,
                message: "Chỉnh sửa thông tin vị trí thành công",
                content: capNhatViTri,
                dateTime: jsonDate
            }
        }
    }
    //xóa vị trí
    async xoaViTri(idDelete: number): Promise<any> {
        // tìm vị trí theo id
        let checkIdLocation = await this.prisma.viTri.findFirst({
            where: {
                id: idDelete
            }
        })
        let jsonDate = (new Date()).toJSON();
        
        try {
            // nếu id khác null thì xóa theo id
            if (checkIdLocation !== null) {
                await this.prisma.viTri.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    data: {
                        statusCode: 201,
                        message: "Xóa thông tin vị trí thành công",
                        content: null,
                        dateTime: jsonDate
                    }
                }
                // còn không thì 404 not found
            } else {
                return {
                    statusCode: 404,
                    message: "Vị trí không tồn tại hoặc đã xóa",
                    content: null,
                    dateTime: jsonDate
                }
            }
        } catch {
            let kiemTraViTriNeuCoPhongDuocDat = await this.prisma.phong.findMany({
                where: { ma_vi_tri: idDelete }
            })
            // nếu khác null thì có phòng đang dùng trả 403
            if (kiemTraViTriNeuCoPhongDuocDat !== null) {
                throw new HttpException({
                    statusCode: 403,
                    message: "Mã vị trí này không xóa được vì có phòng đang dùng",
                    data: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            } else {
                return false
            }
        }
    }

    //Upload hình mới về vị trí
    async uploadHinhAnhViTri(maViTri: number, filename: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        let kiemTraMaViTri = await this.kiemTraMaViTri(maViTri);
        //khi kiemTraMaViTri nếu true thì return update còn false thì lỗi
        try {
            if (kiemTraMaViTri) {
                await this.prisma.viTri.update({
                    data: { hinh_anh: filename },
                    where: {
                        id: maViTri
                    }
                })
                return {
                    statusCode: 201,
                    message: "Cập nhật ảnh thành công",
                    content: filename,
                    dateTime: jsonDate
                }
            } else {
                return false
            }
        }
        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Mã vị trí lỗi hoặc không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
    }
    //check mã vị trí nếu có thì update không thì lỗi 404
    async kiemTraMaViTri(ma_vi_tri: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            let checkId = await this.prisma.viTri.findFirst({
                where: {
                    id: ma_vi_tri
                }
            })
            // nếu null thì check false
            if (checkId === null) {
                return {
                    check: false,
                }
            } else {
                return {
                    check: true,
                }
            }
        } catch {
            throw new HttpException({
                statusCode: 404,
                message: "Không tìm thấy mã vị trí",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }

    }
}
