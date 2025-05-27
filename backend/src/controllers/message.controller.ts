import cloudinary from '@lib/cloudinary';
import Message from '@models/message.model';
import User from '@models/user.model';
import { Request, Response } from 'express';

const getUsersForSidebar = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const loggedInUserId = (req as any).user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('Error in getUsersForSidebar controller', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id: receiverId } = req.params;
    const senderId = (req as any).user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = (req as any).user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    (await newMessage).save();

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controller', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export default { getUsersForSidebar, getMessages, sendMessage };
