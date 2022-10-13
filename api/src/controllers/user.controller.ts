import { FastifyReply, FastifyRequest } from "fastify";
import { createUserResponseSchema, CreateUserSchema, LoginShema, UpdateUserSchema } from "../configs/user.schema";
import { createUser, deleteUserById, findUserByEmail, findUserById, updateUserById } from "../handlers/user.handler";
import { app } from "../server";
import { verifyPassword } from "../utils/password";


export const registerUserController = async (req: FastifyRequest<{ Body: CreateUserSchema }>, res: FastifyReply) => {
    const body = req.body;
    try {
        const user = await createUser(body);
        res.code(201).send(user);
    } catch (error) {
        console.log(error);
        return res.code(500);
    }
}

export const loginController = async (req: FastifyRequest<{ Body: LoginShema }>, res: FastifyReply) => {
    const body = req.body;
    try {

        const user = await findUserByEmail(body.email);
        if (!user) return res.code(401).send({ message: "Invalid email or password" });

        const isCorrectPassword = await verifyPassword({ password: body.password, hashedPassword: user.password })
        if (!isCorrectPassword) res.code(401).send({ message: "Invalid email or password" });

        const { password, ...rest } = user;

        res.code(200).send({ accessToken: app.jwt.sign(rest) });
    } catch (error) {
        res.code(500).send(error)
    }
}

export const profileController = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
    const { id } = req.params;
    try {
        if (req.user.id != id) return res.code(401).send({ message: "Not Authorized" });

        const user = await findUserById(id);
        if (!user) return res.code(401).send({ message: "No such user" });

        const responseData = createUserResponseSchema.parse(user);
        // console.log(req.user.id)
        res.code(201).send(responseData);
    } catch (error) {
        res.code(500).send(error)
    }
}

export const updateProfileContoller = async (req: FastifyRequest<{ Body: UpdateUserSchema, Params: { id: string } }>, res: FastifyReply) => {
    const body = req.body
    const { id } = req.params
    try {
        if (req.user.id != id) return res.code(401).send({ message: "Not Authorized" });

        const user = await findUserById(id);
        if (!user) return res.code(401).send({ message: "No such user" });

        const isCorrectPassword = await verifyPassword({ password: body.password, hashedPassword: user.password })
        if (!isCorrectPassword) res.code(401).send({ message: "Invalid email or password" });

        const updatedUser = await updateUserById(id, body)
        const responseData = createUserResponseSchema.parse(updatedUser)
        res.code(201).send(responseData)
    } catch (error) {
        res.code(500).send(error)
    }
}

export const deleteProfileController = async (req: FastifyRequest<{ Body: { password: string }, Params: { id: string } }>, res: FastifyReply) => {
    const { password } = req.body;
    const { id } = req.params;
    try {
        if (req.user.id != id) return res.code(401).send({ message: "Not Authorized" });

        const user = await findUserById(id);
        if (!user) return res.code(401).send({ message: "No such user" });

        const isCorrectPassword = await verifyPassword({ password, hashedPassword: user.password })
        if (!isCorrectPassword) throw ("Invalid User");

        const deletedUser = await deleteUserById(id);
        // console.log({ DELETED: true, isCorrectPassword })
        res.code(201).send(deletedUser)
    } catch (error) {
        res.code(500).send(error)
    }
}