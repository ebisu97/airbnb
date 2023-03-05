import { ApiProperty } from "@nestjs/swagger";

export class AccessToken{
    @ApiProperty({type:String, description:"Vui lòng nhập access token", required:false})
    token:string
}