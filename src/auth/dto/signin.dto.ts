import { ApiProperty } from "@nestjs/swagger"

export class DangNhap{
    @ApiProperty ({type:String})
    email:string

    @ApiProperty({type:String})
    pass_word:string
    
}