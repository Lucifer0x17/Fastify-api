import { createUserSchema, CreateUserSchema, UpdateUserSchema } from "../configs/user.schema"
import { hashPassword } from "../utils/password";
import prisma from "../utils/prisma"


export const createUser = async (data: CreateUserSchema) => {
    const { password, ...userData } = data;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: { ...userData, password: hashedPassword }
    })

    return user;
}

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
        }
    });
}

export const findUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {
            id,
        }
    });
}

export const updateUserById = async (id: string, data: UpdateUserSchema) => {
    const newUser = createUserSchema.parse(data)
    if (data.newPassword) {
        const hashedPassword = await hashPassword(data.newPassword);
        newUser.password = hashedPassword;
    } else {
        newUser.password = await hashPassword(data.password);
    }
    return prisma.user.update({
        where: {
            id
        },
        data: {
            ...newUser
        }
    })
}

export const deleteUserById = async (id: string) => {
    return prisma.user.delete({
        where: {
            id
        }
    })
}