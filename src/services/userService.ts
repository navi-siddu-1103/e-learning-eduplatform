import { User } from '../models/User';
import { Document } from 'mongoose';

interface UserType {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'educator';
  profilePicture?: string;
  bio?: string;
  enrolledCourses?: string[];
  createdCourses?: string[];
}

interface UserService {
  findByEmail(email: string): Promise<UserType | null>;
  createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'educator';
  }): Promise<UserType>;
  updateProfile(userId: string, updateData: {
    name?: string;
    bio?: string;
    profilePicture?: string;
  }): Promise<UserType | null>;
  enrollInCourse(userId: string, courseId: string): Promise<UserType | null>;
  withdrawFromCourse(userId: string, courseId: string): Promise<UserType | null>;
}

const toUser = (doc: Document & UserType): UserType => ({
  _id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  password: doc.password,
  role: doc.role,
  profilePicture: doc.profilePicture,
  bio: doc.bio,
  enrolledCourses: doc.enrolledCourses,
  createdCourses: doc.createdCourses
});

export const userService: UserService = {
  async findByEmail(email: string) {
    const user = await User.findOne({ email }).select('+password');
    return user ? toUser(user) : null;
  },

  async createUser(userData) {
    return await User.create(userData);
  },

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    return user ? toUser(user) : null;
  },

  async enrollInCourse(userId, courseId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    ).select('-password');
    return user ? toUser(user) : null;
  },

  async withdrawFromCourse(userId, courseId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { enrolledCourses: courseId } },
      { new: true }
    ).select('-password');
    return user ? toUser(user) : null;
  }
};
