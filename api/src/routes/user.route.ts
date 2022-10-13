import { FastifyInstance } from "fastify";
import { $ref } from "../configs/user.schema";
import { deleteProfileController, loginController, profileController, registerUserController, updateProfileContoller } from "../controllers/user.controller";


const userRoutes = async (router: FastifyInstance) => {
    router.post(
        '/signup',
        {
            schema: {
                body: $ref('createUserSchema'),
                response: {
                    201: $ref('createUserResponseSchema')
                }
            }
        },
        registerUserController
    );

    router.post('/login', {
        schema: {
            body: $ref('loginSchema'),
            response: {
                200: $ref('loginResponseSchema')
            }
        }
    }, loginController)

    router.get('/profile/:id', {
        preHandler: [router.authenticate]
    }, profileController)

    router.put('/profile/:id', {
        preHandler: [router.authenticate]
    }, updateProfileContoller)

    router.delete('/delete/:id', {
        preHandler: [router.authenticate]
    }, deleteProfileController)
}

export default userRoutes;