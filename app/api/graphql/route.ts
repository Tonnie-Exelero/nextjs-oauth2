import { createYoga } from "graphql-yoga"
import { schema } from "@/graphql/schema"
import { cookies } from "next/headers"
import { getToken } from "next-auth/jwt"

// Create a Yoga instance with the schema
const { handleRequest } = createYoga({
  schema,
  // Yoga needs to know how to create a response
  fetchAPI: { Response },
  // Configure GraphQL context
  context: async ({ request }) => {
    // Get the session token from the cookies
    const cookieStore = cookies()
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    return {
      token,
      userId: token?.userId as string | undefined,
    }
  },
})

// Export GET and POST handlers
export { handleRequest as GET, handleRequest as POST }

