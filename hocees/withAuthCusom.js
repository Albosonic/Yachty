import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const withAuthGaurd = (WrappedComponent) => {
  const WithAuthGaurd = (props) => {
    const router = useRouter()
    const session = useSession()
    const {status} = session
    if (router.pathname === '/') return null
    if (status === 'unauthenticated') {
      router.push('/')
      return null
    }
    return <WrappedComponent {...props} />;
  };
  return WithAuthGaurd;
};

export default withAuthGaurd;