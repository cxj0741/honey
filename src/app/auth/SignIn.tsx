import { signIn } from 'next-auth/react';

const SignIn = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn('credentials')}>Sign in with Credentials</button>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      {/* 其他登录选项 */}
    </div>
  );
};

export default SignIn