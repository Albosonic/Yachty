import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/lib/clients/apollo-client";
import { GET_YC_MEMBER } from "@/lib/gqlQueries/yachtygql";

const options = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        console.log('profile =======', profile)
        return {
          ...profile
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username:',
          type: 'text',
          placeholder:'username'
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials) {
        // todo: integrate with hasura
        const user = {id: 1, name: 'albosonic', password: 'nextauth'}
        return user
      },
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({token, user}) {
      console.log('user =========', user)
      // *** token['x-hasura-allowed-roles'] = ["admin", user] *******
      if (user) token.role = 'awesome'
      return token
    },
    async session({session, token}) {
      if (session.user) session.user.role = 'awesome'
      return session
    },
  },
}

export default (req, res) => NextAuth(req, res, options)