import SchemaBuilder from "@pothos/core"
import PrismaPlugin from "@pothos/plugin-prisma"
import { prisma } from "@/lib/prisma"
import type PrismaTypes from "@pothos/plugin-prisma/generated"
import { DateTimeResolver } from "graphql-scalars"

// Create a schema builder with Prisma
const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: {
    userId?: string
  }
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
})

// Add DateTime scalar
builder.addScalarType("DateTime", DateTimeResolver, {})

// Define User type
builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    email: t.exposeString("email", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    lastLogin: t.expose("lastLogin", { type: "DateTime", nullable: true }),
  }),
})

// Define Query type
builder.queryType({
  fields: (t) => ({
    // Get current user
    me: t.prismaField({
      type: "User",
      nullable: true,
      resolve: async (query, _root, _args, ctx) => {
        if (!ctx.userId) return null

        return prisma.user.findUnique({
          ...query,
          where: { id: ctx.userId },
        })
      },
    }),

    // Get user by ID
    user: t.prismaField({
      type: "User",
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        // Only allow users to fetch their own data or implement admin checks
        if (ctx.userId !== args.id) {
          throw new Error("Not authorized")
        }

        return prisma.user.findUnique({
          ...query,
          where: { id: args.id },
        })
      },
    }),
  }),
})

// Export the schema
export const schema = builder.toSchema()

