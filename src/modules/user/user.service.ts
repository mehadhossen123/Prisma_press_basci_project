import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcrypt";
import { UserPayLoadInterface } from "../../utilities/type";

const createUserIntoDb = async (payload: UserPayLoadInterface) => {
  const { name, email, password, profilePhoto } = payload;
  //   user exist in the database ?
  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExist) {
    throw new Error("User already exist in this email");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const CreatedUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: CreatedUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: CreatedUser.id,
      email: CreatedUser.email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

export const userService = {
  createUserIntoDb,
};
