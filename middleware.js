import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(request) {
        // request available here
    },
    {
      callbacks: {
        authorized: ({token}) =>  {          
          return token?.role === 'awesome'
        },        
      }
    }
)

export const config = {
  matcher: ["/((?!api|login|$|_next/static|_next/image|favicon.ico).*)"],  
}