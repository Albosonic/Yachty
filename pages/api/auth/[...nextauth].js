import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        // console.log('profile ======', profile)
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
      async aithorize({credentials}) {
        console.log('credentials ========', credentials)
        const user = {id: 1, name: 'albosonic', password: 'nextauth'}
        return user
      },
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) token.role = user.role
      return token
    },
    async session({session, token}) {
      if (session.user) session.user.role = token.role
      return session
    }  
  },
}

export default (req, res) => NextAuth(req, res, options)