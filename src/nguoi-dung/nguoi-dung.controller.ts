import { TokenService } from './../token/token.service';
import { NguoiDungService } from './nguoi-dung.service';
import { Controller, Get, Headers, Param, Post, Body, HttpCode, Query, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CapNhatNguoiDung, ThongTinNguoiDung } from './dto/nguoiDung.dto';
import { Token } from 'src/token/dto/token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadAvatar, UploadAvatar } from './dto/uploadAvatar.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';


@ApiTags("NguoiDung")
@Controller('/api')
export class NguoiDungController {

    constructor (
        private nguoiDungService: NguoiDungService,
        private tokenService: TokenService
    ) { }

    @Get("/users")
    async getListNguoiDung(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getListNguoiDung()
        } else {
            return this.tokenService.checkToken(headers)
        }
    }

    //thêm người dùng mới
    @HttpCode(201)
    @Post("/users")
    async themNguoiDungMoi(@Body() body: ThongTinNguoiDung, @Headers() headers: Token): Promise<any> {

        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            const { id, name, email, pass_word, phone, birth_day, gender, role } = body;
            return this.nguoiDungService.themNguoiDungMoi(id, name, email, pass_word, phone, birth_day, gender, role
            )
        } else {
            return this.tokenService.checkToken(headers)
        }

    }

    //xóa người dùng
    @Delete("/users")
    @ApiQuery({ name: "id", type: Number, description: "Nhập id người dùng" })
    async xoaNguoiDung(@Headers() headers: Token, @Query("id") idParam: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.xoaNguoiDung(Number(idParam))
        } else {
            return this.tokenService.checkToken(headers)
        }

    }

    //lấy danh sách người dùng theo trang
    @ApiQuery({ name: 'pageIndex', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'keyWord', required: false, type: String, description: "Tìm kiếm người dùng theo tên" })

    @HttpCode(200)
    @Get("/users/phan-trang-tim-kiem")
    async danhSachNguoiDungTheoTrang(@Headers() headers: Token, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyWord") keyWord: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.danhSachNguoiDungTheoTrang(Number(pageIndex), Number(pageSize), keyWord)
        } else {
            return data
        }
    }

    // lấy thông tin người dùng theo id
    @HttpCode(200)
    @Get("/users/:id")
    async getUserById(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getUserById(Number(id))
        } else {
            return data
        }
    }

    //cập nhật thông tin người dùng
    @HttpCode(200)
    @Put("/users/:id")
    async chinhSuaThongTinNguoiDung(@Headers() headers: Token, @Param("id") idParam: number, @Body() body: CapNhatNguoiDung): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            const { name, email, pass_word, phone, birth_day, gender, role } = body;
            return this.nguoiDungService.chinhSuaThongTinNguoiDung(
                Number(idParam), name, email, pass_word, phone, birth_day, gender, role)
        } else {
            return this.tokenService.checkToken(headers)
        }
    }

    //tìm kiếm người dùng theo tên
    @Get("/users/search/:TenNguoiDung")
    async getUserByUserName(@Headers() headers: Token, @Param("TenNguoiDung") TenNguoiDung: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getUserByUserName(TenNguoiDung)
        } else {
            return data
        }
    }

    //setting đường dãn hình ảnh vô public/img
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("userPhoto", {
        storage: diskStorage({
            destination: "src/public/img",
            filename(req, file, callback) {
                let date = new Date();
                callback(null, `${date.getTime()}-${file.originalname}`);
            },
        })
    }))
    @ApiBody({
        description: 'userPhoto',
        type: FileUploadAvatar,
    })


    // upload hình avatar
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Post("/users/upload-avatar")
    async uploadHinhAvatar(@Headers() headers: Token, @Headers() tokenHeader: any, @UploadedFile() file: UploadAvatar): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let jsonDate = (new Date()).toJSON();
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userId = checkData.info.id
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
                    return this.nguoiDungService.uploadHinhAvatar(
                        Number(userId), file.filename)
                }
            } else {
                return this.tokenService.checkToken(headers)
            }
        } else {
            return checkData.data
        }
    }
}
