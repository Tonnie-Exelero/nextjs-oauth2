import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { LoginButton, LogoutButton } from "@/components/auth-buttons"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8">Next.js with GraphQL and OAuth</h1>

        {session ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="flex flex-col items-center space-y-4">
              {session.user?.image && (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user?.name || "User"}
                  className="h-24 w-24 rounded-full"
                />
              )}
              <h2 className="text-2xl font-semibold">Welcome, {session.user?.name}!</h2>
              <p className="text-gray-500">{session.user?.email}</p>
              <div className="flex space-x-4 mt-4">
                <Link href="/profile" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  View Profile
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign in to your account</h2>
            <div className="space-y-4">
              <LoginButton />
              <p className="text-sm text-center text-gray-500 mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

