import { encryptAdapter, envs, JwtAdapter } from '../../../config';

import { User } from '../../../data/postgres/models/user.model';

import { CustomError } from '../../../domain';

import { LoginUserDto } from '../../../domain/dtos/users/login-user.dto';

export class LoginUserService {
  async execute(credentials: LoginUserDto) {
    console.log('LoginUserService.execute - credentials:', credentials);
    const user = await this.ensureUserExist(credentials);
    console.log('LoginUserService.execute - user found:', user?.id);

    this.ensurePasswordIsCorrect(credentials, user);
    console.log('LoginUserService.execute - password correct');

    const token = await this.generateToken({ id: user.id }, envs.JWT_EXPIRE_IN);
    console.log('LoginUserService.execute - token generated:', token);

    return {
      token,
      user: {
        id: user.id,
        fullname: user.name,
        email: user.email,
        rol: user.role,
      },
    };
  }

  private ensurePasswordIsCorrect(credentials: LoginUserDto, user: User) {
    console.log(
      'LoginUserService.ensurePasswordIsCorrect - comparing passwords',
    );
    const isMatch = encryptAdapter.compare(credentials.password, user.password);
    console.log('LoginUserService.ensurePasswordIsCorrect - isMatch:', isMatch);
    if (!isMatch) {
      console.log(
        'LoginUserService.ensurePasswordIsCorrect - invalid credentials',
      );
      throw CustomError.unAuthorized('Invalid Credentials');
    }
  }

  private async ensureUserExist(credentials: LoginUserDto) {
    console.log(
      'LoginUserService.ensureUserExist - searching for user:',
      credentials.email,
    );
    const user = await User.findOne({
      where: {
        email: credentials.email,
        status: true,
      },
    });
    console.log('LoginUserService.ensureUserExist - user:', user);
    if (!user) {
      console.log(
        'LoginUserService.ensureUserExist - user not found or inactive',
      );
      throw CustomError.unAuthorized('Invalid Credentials');
    }
    return user;
  }

  private async generateToken(payload: any, duration: string) {
    console.log(
      'LoginUserService.generateToken - payload:',
      payload,
      'duration:',
      duration,
    );
    const token = await JwtAdapter.generateToken(payload, duration);
    console.log('LoginUserService.generateToken - token:', token);
    if (!token) throw CustomError.internalServer('Error while creating jwt');
    return token;
  }
}
