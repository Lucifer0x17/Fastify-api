import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { userSchemas } from './configs/user.schema'
import userRoutes from './routes/user.route'
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import fastifyJwt from '@fastify/jwt'

export const app = Fastify()
const port = 3000

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

app.register(fastifyJwt, {
    secret: "5d2ae7ea-4da4-453c-bf16-f0b1703fb7d8"
})

app.decorate('authenticate', async (req: FastifyRequest, res: FastifyReply) => {
    try {
        await req.jwtVerify()
    } catch (error) {
        return res.send(error)
    }
})


app.get('/', async () => {
    return { status: "OK" }
})

async function server() {

    for (const schema of userSchemas) {
        app.addSchema(schema)
    }

    await app.register(
        swagger,
        {
            swagger: {
                info: {
                    title: "Tweepsbook Assignment",
                    version: "1.1.1"
                }
            }
        }
    )

    await app.register(
        swaggerUi, {
        baseDir: '/path/to/external/spec/files/location',
        routePrefix: '/documentation',
        initOAuth: {},
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header
    }
    )

    app.register(userRoutes, { prefix: "api/users" })

    try {
        await app.listen({ port });
        console.log(`Listing on port:${port}`)
    } catch (error) {
        throw error;
    }
}

server();