import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(request) {
        console.log('path =======', request.nextUrl)
        console.log('token =======', request.nextauth.token)
    },
    {
      callbacks: {
        authorized: ({token}) =>  token?.role === 'admin',        
      }
    }
)

export const config = {
  matcher: ["/((?!api|login|_next/static|_next/image|favicon.ico).*)"],  
}