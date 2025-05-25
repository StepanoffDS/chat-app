import { CreateUserDTO, LoginUserDTO } from '@dto/user.dto';
import cloudinary from '@lib/cloudinary';
import { generateToken } from '@lib/utils';
import User from '@models/user.model';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

const signup = async (req: Request, res: Response): Promise<any> => {
  const { email, password, fullName } = req.body as CreateUserDTO;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });

    if (!newUser) {
      return res.status(500).json({ message: 'Something went wrong' });
    }

    generateToken(newUser._id, res);
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    console.log('Error in signup controller', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body as LoginUserDTO;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);
    return res.status(200).json(user);
  } catch (error) {
    console.log('Error in login controller', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log('Error in logout controller', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { profilePic } = req.body;
    const userId = (req as any).user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error in updateProfile controller', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const checkAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    return res.status(200).json(user);
  } catch (error) {
    console.log('Error in checkAuth controller', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export default { signup, login, logout, updateProfile, checkAuth };
