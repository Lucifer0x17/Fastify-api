import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userCommon = {
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Invalid Email"
    }).email(),
    name: z.string()
}

export const createUserSchema = z.object({
    ...userCommon,
    password: z.string({
        required_error: "Password is required"
    })
})

export const createUserResponseSchema = z.object({
    id: z.string(),
    ...userCommon
})

const updateUserSchema = z.object({
    ...userCommon,
    password: z.string({
        required_error: "Password is required"
    }),
    newPassword: z.string({
        required_error: "Password is required"
    }).optional()
})

const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Invalid Email"
    }).email(),
    password: z.string({
        required_error: "Password is required"
    })
})

const loginResponseSchema = z.object({
    accessToken: z.string()
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export type UpdateUserSchema = z.infer<typeof updateUserSchema>

export type LoginShema = z.infer<typeof loginSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
})

