import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LogoutButton } from "@/components/auth-buttons"
import { getUserProfile } from "@/lib/user-service"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Fetch additional user data from our GraphQL API
  const userProfile = await getUserProfile(session.user.id)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            {session.user?.image && (
              <img
                src={session.user.image || "/placeholder.svg"}
                alt={session.user?.name || "User"}
                className="h-32 w-32 rounded-full"
              />
            )}
          </div>

          <div className="flex-grow">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-lg">{session.user?.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{session.user?.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Account created</h3>
                <p className="mt-1 text-lg">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last login</h3>
                <p className="mt-1 text-lg">
                  {userProfile?.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

