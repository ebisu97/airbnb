import { ApiProperty } from "@nestjs/swagger";

export class Token{
    @ApiProperty({type:String,description:"Nhập Token Cybersoft"})
    tokencybersoft:string
}