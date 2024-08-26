import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/lib/clients/apollo-client";
import { gql } from "@apollo/client";
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GET_YC_MEMBER } from "@/lib/gqlQueries/yachtygql";


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
  }
}`

const options = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        // console.log('profile =======', profile)
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
          variables: {email: credentials.email},
        })

        const memberData = resp.data.yc_members[0]
        // console.log('memberdata =========>>', memberData)
        if (memberData === undefined) {
          return {
            email: credentials.email,
            noClub: true,
          }
        }

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
      console.log('user ======>>>', user)
      
      if (user) {
        token.role = 'awesome'
        token.noClub = user.noClub
        token.memberInfo = user
      }
      return token
    },
    async session({session, token}) {            
      if (session.user) {
        session.user.role = 'awesome'
        session.user.noClub = token.noClub
        session.user.memberInfo = token.memberInfo
        // console.log('token ===== in session', token)
        // console.log('session ===========', session)
      }

      return session
    },
  },
}

export default (req, res) => NextAuth(req, res, options)