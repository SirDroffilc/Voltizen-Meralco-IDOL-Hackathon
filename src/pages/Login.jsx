import useAuth from "../firebaseServices/auth/useAuth";

function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div>
      <h1>Authentication</h1>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  )
}

export default Login;