import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/lib/clients/apollo-client";
import { gql } from "@apollo/client";
import bcrypt from "bcrypt";

const GET_USER = gql`
  query getUser($email: String) {
  yc_members(where: {email: {_eq: $email}}) {
    email
    firstName
    id
    active
    bio
    duesOwed
    isRacer
    lastLogin
    lastName
    name
    profilePic
    yacht_club
    secondEmail
    secondFirstName
    secondLastName
    secondName
    hash
  }
}`

const options = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {        
        return {
          ...profile
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials) {
        const resp = await client.query({
          query: GET_USER,
          variables: {
            email: credentials.email
          },
        })
        const memberData = resp.data.yc_members[0]
        if (memberData === undefined) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(credentials.password, salt);
          return {
            email: credentials.email,
            hash: hash,
            noClub: true,
          }
        }

        const comapreHash = async () => {
          const result = await bcrypt.compare(credentials.password, memberData.hash)
          return result
        }
        const result = await comapreHash()

        if (!result && process.env.NEXT_PUBLIC_ENV !== 'TEST') return null

        return {
          id: 1,
          email: credentials.email,
          noClub: false,
          ...memberData,
        }

      },
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({token, user}) {
      // *** token['x-hasura-allowed-roles'] = ["admin", user] *******
      if (user) {
        token.role = 'awesome'
        token.noClub = user.noClub
        token.memberInfo = user
        token.hash = user.hash
      }
      return token
    },
    async session({session, token}) {
      if (session.user) {
        session.user.role = 'awesome'
        session.user.noClub = token.noClub
        session.user.memberInfo = token.memberInfo
        session.user.hash = token.hash
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
}

export default (req, res) => NextAuth(req, res, options)