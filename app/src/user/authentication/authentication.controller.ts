import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CheckTokenDto, LoginDto, TokenResponse } from './dto';

@ApiTags('User Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(public authenticationService: AuthenticationService) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({ type: () => TokenResponse })
  async login(@Body() body: LoginDto): Promise<TokenResponse> {
    const token = await this.authenticationService.login(body.name);

    // In a production environment
    // login() wouldn't always return a token.
    // See checkToken on how we'd handle that.

    return {
      token,
    };
  }

  /**
   * This flow isn't really needed here, as we could just always call login() in this implementation.
   * It's a good example of how to a true login flow would work.
   */
  @Post('/check-token')
  @HttpCode(200)
  @ApiOkResponse({ type: () => TokenResponse })
  async checkToken(@Body() body: CheckTokenDto): Promise<TokenResponse> {
    try {
      const token = await this.authenticationService.checkToken(body.token);

      return {
        token,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
