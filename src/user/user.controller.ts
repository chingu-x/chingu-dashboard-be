import { Controller, Get, HttpCode } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @HttpCode(200)
    create() {
        return this.userService.getUser()
    }
}
