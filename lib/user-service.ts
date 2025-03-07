import { gql } from "@apollo/client";
import { getClient } from "@/lib/apollo-server-client";

const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      name
      email
      image
      createdAt
      lastLogin
    }
  }
`;

export async function getUserProfile(userId: string) {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: GET_USER_PROFILE,
      variables: { id: userId },
    });

    return data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
