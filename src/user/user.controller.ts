import { Controller, Get, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
     constructor(private userService: UserService) { }

     @Get()
     @HttpCode(200)
     create() {
          console.log("Controller hit")
          return this.userService.getUser();
     }
}
