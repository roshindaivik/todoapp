import User from "../entity/User";
import AppDataSource from "../util/data-source";
import { generateToken } from "../util/validators";

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  public async registerUser(userBody: {
    username: string;
    email: string;
    password: string;
  }) {
    const user: User = new User();
    user.email = userBody.email;
    user.password = userBody.password;
    user.username = userBody.username;
    const userInserted = await this.userRepository.save(user);
    const token: string = generateToken(userInserted);
    return {
      result: {
        success: true,
        msg: "successfully created user",
        token,
      },
      statusCode: 201,
    };
  }
}

export default UserService;
