import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { User, type IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";

const publicUser = (user: IUser) => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  role: user.role,
  totalPoints: user.totalPoints,
  currentStreak: user.currentStreak,
  longestStreak: user.longestStreak,
});

export class AuthService {
  private tokenFor(userId: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) throw new ApiError(500, "JWT_SECRET must contain at least 32 characters.");
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
    return jwt.sign({ sub: userId }, secret, { expiresIn });
  }

  async register(input: { username: string; email: string; password: string }) {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) throw new ApiError(409, "That username or email is already in use.");
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({ username, email, passwordHash });
    return { user: publicUser(user), token: this.tokenFor(user._id.toString()) };
  }

  async login(input: { email: string; password: string }) {
    const user = await User.findOne({ email: input.email.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new ApiError(401, "The email or password is incorrect.");
    }
    return { user: publicUser(user), token: this.tokenFor(user._id.toString()) };
  }

  async currentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found.");
    return publicUser(user);
  }
}