"use client"

import { signIn, signOut } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-black font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm"
    >
      <FcGoogle className="h-5 w-5" />
      <span>Sign in with Google</span>
    </button>
  )
}

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Sign Out
    </button>
  )
}

