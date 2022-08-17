import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import CreateUserDto from '../authentication/user.dto';
import User from '../authentication/user.entity';
import HttpException from '../exceptions/HttpException';
import { CreateAlgoWallet, isEmpty } from '../utils/utils';
import { Wallet, WalletBalance } from '../wallet/wallet.entity';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { compare } from 'bcryptjs';
import LoginDto from './login.dto';
import 'dotenv/config';

class AuthenticationService {
  private userRepository = getRepository(User);
  private WalletRepository = getRepository(Wallet);
  private BalanceRepository = getRepository(WalletBalance);

  public async register(userData: CreateUserDto) {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.userRepository.findOne({
      email: userData.email,
    });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    if (user) {
      const wallet = await CreateAlgoWallet();
      const Wallet = this.WalletRepository.create({
        public_key: wallet.address,
        private_key: wallet.Key,
        user: user,
      });
      await this.WalletRepository.save(Wallet);
      const balance = this.BalanceRepository.create({ amount: 0.0, user: user, wallet: Wallet });
      await this.BalanceRepository.save(balance);
    }
    return {
      user,
    };
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.userRepository.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'incorrect password');

    const tokenData = this.createToken(findUser);
    // const cookie = this.createCookie(tokenData);

    return { tokenData };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.userRepository.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = process.env.secret_key;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public async UpdatePassword(password?: string, passwordNew?: string, email?: string) {
    if (isEmpty(password)) throw new HttpException(400, 'password cannot be empty');
    if (isEmpty(passwordNew)) throw new HttpException(400, 'password cannot be empty');

    const findUser: User = await this.userRepository.findOne({ where: { email: email } });

    const isPasswordMatching: boolean = await compare(password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'incorrect password');

    if (isPasswordMatching) {
      const hashedPassword = await bcrypt.hash(passwordNew, 10);
      findUser.password = hashedPassword;
      this.userRepository.save(findUser);
    }

    return 'done';
  }
}

export default AuthenticationService;
