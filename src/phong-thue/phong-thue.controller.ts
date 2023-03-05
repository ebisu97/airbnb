import { Controller, Get, Headers, Param, Post, Body, HttpCode, Query, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Token } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { PhongThueService } from './phong-thue.service';
import { PhongViewModel } from './dto/phong-thue.dto';
import { AccessToken } from 'src/token/dto/accessToken.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadHinhPhong, UploadHinhPhong } from './dto/uploadHinh.dto';

@ApiTags("Phong")
@Controller('/api')
export class PhongThueController {

    constructor(
        private phongThueService: PhongThueService,
        private tokenService: TokenService
    ) { }

    //get danh sách phòng
    @Get("/phong-thue")
    async getDanhSachPhong(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.phongThueService.getDanhSachPhong()
        } else {
            return this.tokenService.checkToken(headers)
        }
    }

    //tạo phòng mới
    @HttpCode(201)
    @Post("/phong-thue")
    async themPhongMoi(@Body() body: PhongViewModel, @Headers() headers: Token, @Headers() token: AccessToken): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(token)

        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri } = body;

                let checkAuth = await this.phongThueService.kiemTraQuyenChinhRoom(Number(checkData.info.id))
                console.log("checkAuththemPhong", checkAuth)
                if (checkAuth === true) {
                    return this.phongThueService.themPhongMoi(
                        id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri)
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

    //lấy phòng theo mã vị trí
    @ApiQuery({ name: 'maViTri', required: false, type: Number })
    @Get("/phong-thue/lay-phong-theo-vi-tri")
    async getPhongTheoViTri(@Headers() headers: Token, @Query("maViTri") maViTri: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.phongThueService.getPhongTheoViTri(Number(maViTri))
        } else {
            return data
        }
    }

    //lấy phòng theo danh sách trang
    @ApiQuery({ name: 'pageIndex', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'keyWord', required: false, type: String,description:"Search theo tên phòng hoặc mô tả" })

    @Get("/phong-thue/phan-trang-tim-kiem")
    async getDanhSachPhongTheoTrang(@Headers() headers: Token, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyWord") keyWord: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.phongThueService.getDanhSachPhongTheoTrang(Number(pageIndex), Number(pageSize), keyWord)
        } else {
            return data
        }
    }

    //lấy phòng theo id truyền vào
    @Get("/phong-thue/:id")
    async layPhongTheoId(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.phongThueService.layPhongTheoId(Number(id))
        } else {
            return data
        }
    }

    //chỉnh sửa thông tin của phòng
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Put("/phong-thue/:id")
    async chinhSuaThongTinPhong(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number, @Body() body: PhongViewModel): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)

        if (checkData.check === true && checkData.logInfo===true) {
            let data = await this.tokenService.checkToken(headers);
            
            if (data === true) {
                const { id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri } = body;
                
                let checkAuth = await this.phongThueService.kiemTraQuyenChinhRoom(Number(checkData.info.id))

                if (checkAuth === true) {
                    return this.phongThueService.chinhSuaThongTinPhong(
                        Number(idParam),id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri)
                }
                else {
                    return checkAuth.data
                }
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }
    }
    
    //xóa phòng
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Delete("/phong-thue/:id")
    async xoaPhong(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.phongThueService.kiemTraQuyenChinhRoom(Number(userRole))
                if (checkAuth === true) {
                    return this.phongThueService.xoaPhong(
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
    //Setting đường dẫn hình ảnh
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("roomPhoto", {
        storage: diskStorage({
            destination: "src/public/img",
            filename(req, file, callback) {
                let date = new Date();
                callback(null, `${date.getTime()}-${file.originalname}`);
            },
        })
    }))
    @ApiBody({
        description: 'roomPhoto',
        type: FileUploadHinhPhong,
    })
    // upload hình phòng
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @ApiQuery({ name: 'maPhong', required: false, type: Number })
    @Post("/phong-thue/upload-hinh-phong")
    async uploadHinhPhong(@Headers() headers: Token, @Headers() tokenHeader: any,@Query("maPhong") maPhong:number,@UploadedFile() file:UploadHinhPhong): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let jsonDate = (new Date()).toJSON();
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.phongThueService.kiemTraQuyenChinhRoom(Number(userRole))

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
                        return this.phongThueService.uploadHinhPhong(
                            Number(maPhong),file.filename)
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
