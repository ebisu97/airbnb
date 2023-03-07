import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NguoiDungService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    // list danh sách người dùng bằng findmany
    @HttpCode(200)
    async getListNguoiDung(): Promise<any> {
        let data = await this.prisma.nguoiDung.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            message: "Lấy thông tin user thành công",
            content: data,
            dateTime: jsonDate
        }
    }


    // thêm người dùng mới
    async themNguoiDungMoi(id: number ,name: string, email: string, pass_word: string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        // kiểm tra xem có email tồn tại chưa với email
        let checkUser = await this.prisma.nguoiDung.findFirst({
            where: {
                email
            },
        })
        
        let jsonDate = (new Date()).toJSON();
        // nếu bằng null thì tạo user mới, còn không thì trả về 400 đã email đã tồn tại
        if (checkUser === null) {

            await this.prisma.nguoiDung.create({
                data: {
                    name, email, pass_word, phone, birth_day, gender, role
                }
            })
            let newUser = await this.prisma.nguoiDung.findFirst({
                where: {
                    email
                },
            })
            return {
                statusCode: 201,
                message: "Thêm người dùng thành công",
                content: {
                    id: newUser.id,
                    name,
                    email,
                    pass_word,
                    phone,
                    birth_day,
                    gender,
                    role
                },
                dateTime: jsonDate
            }
        } else {
            throw new HttpException({ statusCode: 400, message: "Email đã tồn tại", content: null, dateTime: jsonDate }, HttpStatus.BAD_REQUEST)
        }
    }

    // xóa thông tin người dùng theo id
    async xoaNguoiDung(idDelete: number): Promise<any> {
        let checkUser = await this.prisma.nguoiDung.findFirst({
            where: {
                id: idDelete
            }
        })
        let jsonDate = (new Date()).toJSON();
        try {
            // nếu tìm thấy id thì delete và trả kết quả
            if (checkUser.id !== null) {
                await this.prisma.nguoiDung.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    statusCode: 200,
                    message: "Xóa thông tin nguời dùng thành công",
                    data: null,
                    dateTime: jsonDate
                }
            } else {
                // còn không tìm thấy thì trả về không tồn tại
                throw new HttpException({
                    statusCode: 404,
                    message: "Id này không tồn tại",
                    data: null,
                    dateTime: jsonDate
                }, HttpStatus.NOT_FOUND)
            }
        } catch (err) {
            // nếu như null thì có nghĩa là user không tìm thấy
            if (checkUser === null) {
                throw new HttpException({
                    statusCode: 400,
                    message: 'Không tìm thấy người dùng hoặc đã xóa',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
            // nếu người dùng đã bình luận thì không thể xóa
            let checkComment = await this.prisma.binhLuan.findFirst({
                where: { ma_nguoi_binh_luan: idDelete }
            })
            // nếu người dùng đã đặt phòng thì không thể xóa
            let checkRoomBookUser = await this.prisma.datPhong.findFirst({
                where: { ma_nguoi_dat: idDelete }
            })
            if (checkComment !== null) {
                throw new HttpException({
                    statusCode: 403,
                    message: 'Xóa thất bại vì người dùng đã tạo bình luận',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
            if (checkRoomBookUser !== null) {
                throw new HttpException({
                    statusCode: 403,
                    message: 'Xóa thất bại vì người dùng đã đặt phòng',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
            else {
                throw new HttpException({
                    statusCode: 403,
                    message: 'Xóa thất bại vì yêu cầu không hợp lệ',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
        }

    }

    // danh sách người dùng theo trang
    async danhSachNguoiDungTheoTrang(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            if (pageIndex !== 0 && pageSize !== 0) {
                if (keyWord === undefined) {
                    let totalRow = await this.prisma.nguoiDung.count({
                    })
                    let data = await this.prisma.nguoiDung.findMany({
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

                }
                else {
                    let totalRow = await this.prisma.nguoiDung.count({
                        where: {
                            OR: [
                                {
                                    name: {
                                        contains: keyWord
                                    },
                                },
                                {
                                    role: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
                    let data = await this.prisma.nguoiDung.findMany({
                        orderBy: { id: 'asc' },
                        where: {
                            OR: [
                                {
                                    name: {
                                        contains: keyWord
                                    },
                                },
                                {
                                    role: {
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
                    }
                    else {
                        return {
                            statusCode: 202,
                            message: "Không tìm thấy kết quả tương ứng từ khóa",
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
                    content: "Số trang và kích thước phải lớn 0",
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        }

        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Yêu cầu không hợp lệ",
                content: "Số trang và kích thước phải lớn 0",
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
    }

   //lấy danh sách người dùng theo id
    async getUserById(id: number): Promise<any> {
        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        else {
            let data = await this.prisma.nguoiDung.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin người dùng thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }

    // chỉnh sửa thông tin theo id
    async chinhSuaThongTinNguoiDung(idParam: number, name: string, email: string, pass_word:string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: idParam
            }
        })
        let checkEmail = await this.prisma.nguoiDung.findFirst({
            where: {
                email: email
            }
        })
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại trong danh sách",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        //KIỂM TRA KHÔNG CHO PHÉP TRÙNG EMAIL VỚI NGƯỜI DÙNG KHÁC KHI CẬP NHẬT
        if (checkEmail && checkEmail.id !== idParam) {
            throw new HttpException({
                statusCode: 403,
                message: "Email đã tồn tại trong danh sách",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.FORBIDDEN)
        }
        else {

            await this.prisma.nguoiDung.update({
                data: {
                    name, email, pass_word, phone, birth_day, gender, role
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateUser = await this.prisma.nguoiDung.findFirst({
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

    // tìm kiếm theo tên người dùng
    async getUserByUserName(name: string): Promise<any> {
        let checkName = await this.prisma.nguoiDung.findMany({
            where: {
                name: {
                    contains: name
                }
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkName.length === 0) {
            throw new HttpException({
                statusCode: 404,
                message: 'Không có kết quả phù hợp. Thử từ khóa khác nhe!',
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        else {
            let data = await this.prisma.nguoiDung.findMany({
                where: {
                    name: { contains: name }
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin người dùng thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }

    // upload hình avatar user

    async uploadHinhAvatar(userId: number, filename: string): Promise<any> {
        await this.prisma.nguoiDung.update({
            data: { avatar: filename },
            where: {
                id: userId
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

