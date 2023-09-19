import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: async (req, res) => {
    try {
      await handleLogin(req, res, {
        returnTo: '/yachty'
      });
      } catch (error) {
        console.error(error);
    }
  },
  logout: async (req, res) => {
    try {
      await handleLogout(req, res, {
        returnTo: '/login'
      });
    } catch (error) {
      console.error(error);
    }
  }
});