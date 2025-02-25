





import { IUser } from '../models/user.model'; // Adjust the path according to your project structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Assuming `User` is the type for your user object
    }
  }
}
