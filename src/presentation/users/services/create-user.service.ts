import { encryptAdapter } from '../../../config/bcrypt.adapter';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { User } from '../../../data';
import { CustomError } from '../../../domain';
import { EmailService } from '../../common/services/email.service';

export class CreatorUserService {
  constructor(private readonly emailService: EmailService) {}

  async execute(data: any) {
    const user = new User();
    console.log('Ejecutamos el servicio de crear usuario');
    user.name = data.name;
    user.email = data.email;
    user.password = encryptAdapter.hash(data.password);
    user.role = data.role || 'user';

    try {
      await user.save();
      await this.sendLinkToEmailFronValidationAccount(data.email);
      return {
        message:
          'User created successfully. Please check your email to validate your account.',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw CustomError.internalServer('Error creating user');
    }
  }

  private sendLinkToEmailFronValidationAccount = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, '300s');
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `http://localhost:3000/api/v1/users/validate-account/${token}`;
    const html = `
      <h1>Validate Your Email</h1>
      <p>Click the link below to validate your email:</p>
      <a href="${link}">${link}</a>
    `;

    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: 'Validate your account!',
      htmlBody: html,
    });

    if (!isSent) throw CustomError.internalServer('Error sending email');
    return true;
  };

  public validateAccount = async (token: string) => {
    const payload = await this.validateToken(token);

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not found in token');

    const user = await this.ensureUserExistsByEmail(email);

    user.status = true;

    try {
      await user.save();
      return 'User activated successfully';
    } catch (error) {
      console.error(error);
      throw CustomError.internalServer('Something went very wrong');
    }
  };

  private async ensureUserExistsByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw CustomError.internalServer('Email not registered in DB');
    }
    return user;
  }

  private async validateToken(token: string) {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest('Invalid Token');
    return payload;
  }
}
