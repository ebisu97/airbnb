import { Controller, Get, Headers, Param, Post, Body, Query, Put, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Token } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { ViTriService } from './vi-tri.service';
import { ViTriViewModel } from './dto/viTri.dto';
import { AccessToken } from 'src/token/dto/accessToken.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadHinhViTri, UploadHinhViTri } from './dto/uploadHinh.dto';

@ApiTags("ViTri")
@Controller('api')
export class ViTriController {
    constructor(
        private viTriService: ViTriService,
        private tokenService: TokenService
    ) { }

    //lấy danh sách vị trí
    @Get("/vi-tri")
    async layDanhSachViTri(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.viTriService.layDanhSachViTri()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //Thêm vị trí mới
    @Post("/vi-tri")
    async themViTriMoi(@Body() body: ViTriViewModel, @Headers() headers: Token, @Headers() token: AccessToken): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(token)

        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh } = body;

                let checkAuth = await this.viTriService.checkAuthAccount(Number(checkData.info.id))
                // console.log("checkAuththemPhong", checkAuth)
                if (checkAuth === true) {
                    return this.viTriService.themViTriMoi(
                        Number(id), ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh)
                } else {
                    return checkAuth.data
                }
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }
    }

    //lấy vị trí theo trang
    @ApiQuery({ name: 'pageIndex', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'keyWord', required: false, type: String, description: "Tìm kiếm theo vị trí hoặc quốc gia" })

    @Get("/vi-tri/phan-trang-tim-kiem")
    async layViTriTheoTrang(@Headers() headers: Token, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyWord") keyWord: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.viTriService.layViTriTheoTrang(Number(pageIndex), Number(pageSize), keyWord)
        } else {
            return data
        }
    }

    //lấy vị trí theo id
    @Get("/vi-tri/:id")
    async danhSachViTriTheoId(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.viTriService.danhSachViTriTheoId(Number(id))
        } else {
            return data
        }
    }

    //chỉnh sửa thông tin vị trí
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Put("/vi-tri/:id")
    async editThongTinViTri(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number, @Body() body: ViTriViewModel): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)

        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);

            if (data === true) {
                const { id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh } = body;

                let checkAuth = await this.viTriService.checkAuthAccount(Number(checkData.info.id))

                if (checkAuth === true) {
                    return this.viTriService.editThongTinViTri(
                        Number(idParam), id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh)
                } else {
                    return checkAuth.data
                }
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }


    }

    //xóa thông tin vị trí
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Delete("/vi-tri/:id")
    async xoaViTri(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.viTriService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    return this.viTriService.xoaViTri(
                        Number(idParam))
                } else {
                    return checkAuth.data
                }
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }
    }

    //setting đường dẫn hình ảnh vị trí
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("locationPhoto", {
        storage: diskStorage({
            destination: "src/public/img",
            filename(req, file, callback) {
                let date = new Date();
                callback(null, `${date.getTime()}-${file.originalname}`);
            },
        })
    }))
    @ApiBody({
        description: 'locationPhoto',
        type: FileUploadHinhViTri,
    })
    //upload hình ảnh vị trí
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @ApiQuery({ name: 'maViTri', required: false, type: Number })
    @Post("/vi-tri/upload-hinh-vitri")
    async uploadHinhAnhViTri(@Headers() headers: Token, @Headers() tokenHeader: any, @Query("maViTri") maViTri: number,
        @UploadedFile()
        file: UploadHinhViTri
    ): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        console.log("file", file)
        let jsonDate = (new Date()).toJSON();
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.viTriService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    if (+file.size > 500000) {
                        throw new HttpException({
                            statusCode: 400,
                            message: "Chỉ có thể upload file nhỏ hơn 500KB",
                            content: null,
                            dateTime: jsonDate
                        }, HttpStatus.BAD_REQUEST)
                    }
                    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png") {
                        throw new HttpException({
                            statusCode: 400,
                            message: "Chỉ có thể upload file dưới định dạng jpg/jpg/png",
                            content: null,
                            dateTime: jsonDate
                        }, HttpStatus.BAD_REQUEST)
                    }
                    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
                        return this.viTriService.uploadHinhAnhViTri(
                            Number(maViTri), file.filename)
                    } else {
                        return false
                    }
                } else {
                    return checkAuth.data
                }
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }
    }
}
