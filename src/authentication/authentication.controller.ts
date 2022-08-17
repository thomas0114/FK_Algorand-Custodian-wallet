import Controller from '../interfaces/controller.interface';
import CreateUserDto from './user.dto';
import AuthenticationService from './auth.service';
import validationMiddleware from '../middleware/validation.middleware';
import { Request, Response, Router, NextFunction } from 'express';
import LoginDto from './login.dto';
import authMiddleware from '../middleware/auth.middleware';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto, 'body'), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto, 'body'), this.logIn);
    this.router.put(`${this.path}/changePassword`, authMiddleware, this.changePassword);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const { user } = await this.authenticationService.register(userData);

      response.status(201).json({ msg: 'user created' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginDto = req.body;
      const tokenData = await this.authenticationService.login(userData);

      // res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: tokenData });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordNew } = req.body;
    const { id, email } = req.user;

    try {
      const updatePassword = await this.authenticationService.UpdatePassword(password, passwordNew, email);
      res.status(200).send(updatePassword);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthenticationController;
