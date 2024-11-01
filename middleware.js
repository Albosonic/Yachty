import { withAuth } from "next-auth/middleware"

// export default withAuth({
//   callbacks: {
//     authorized: ({token}) =>  {          
//       // return token?.role === 'awesome'
//       if (token) return true
//     },        
//   }
// })

export const config = {
  matcher: [
    '/yachty/:path*',
    '/yc_regions/:path*'
  ]
}

// export const config = {
//   matcher: ["/((?!api|login|$|_next/static|_next/image|favicon.ico).*)"],  
// }