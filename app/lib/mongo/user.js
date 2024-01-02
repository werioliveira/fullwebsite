import AccountModel from "@/app/models/Account";
import UserModel from "@/app/models/User";
import bcrypt from "bcrypt";

const createUser = async (body) => {
  try {
    const result = await UserModel.findOne({ email: body.email }).lean().exec();
    const name = body?.email?.split("@")[0];
    if (!result) {
      const hashPassword = await bcrypt.hash(body.password, 10);
      const newUser = await UserModel.create({
        ...body,
        name,
        role: "user",
        password: hashPassword,
      });
      await AccountModel.create({ userId: newUser._id });
      return {
        isError: false,
        data: {
          id: newUser?._id?.toString(),
          name: newUser.name,
          role: newUser.role,
          email: newUser.email,
          avatar: newUser.avatar,
        },
        message: "Success",
      };
    }
    const isMatch = await bcrypt.compare(body.password, result?.password);
    if (!isMatch)
      return { isError: true, data: null, message: "Credentials dosn't match" };

    return {
      isError: false,
      data: {
        id: result?._id?.toString(),
        name: result.name,
        role: result.role,
        email: result.email,
        avatar: result.avatar,
      },
      message: "Success",
    };
  } catch (error) {
    return {
      isError: true,
      data: null,
      message: "Something wrong, try again later",
    };
  }
};
const getCurrentUser = async (id) => {
  try {
    const result = await UserModel.findOne({ _id: id }).lean().exec();
    if (!result) {
      return {
        isError: true,
        data: null,
        message: "User dosn't exists",
      };
    }

    return {
      isError: false,
      data: {
        id: result?._id?.toString(),
        name: result.name,
        role: result.role,
        email: result.email,
        avatar: result.avatar,
      },
      message: "Success",
    };
  } catch (error) {
    return {
      isError: true,
      data: null,
      message: "Something wrong, try again later",
    };
  }
};
const getAllUsers = async () => {
  try {
    const results = await UserModel.find({}).lean().exec();
    const data = results?.map((user) => ({
      id: user?._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }));
    return { isError: false, data, message: "Success" };
  } catch (error) {
    return {
      isError: true,
      data: null,
      message: "Something wrong, try again later",
    };
  }
};

const UserService = { createUser, getCurrentUser, getAllUsers };
export default UserService;
