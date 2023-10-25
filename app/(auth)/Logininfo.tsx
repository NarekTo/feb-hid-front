import { signIn, signOut, useSession } from "next-auth/react";

const LoginInfo: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="ml-auto flex items-center gap-2 justify-center h-full">
      {session?.user ? (
        <>
          <div className="flex px-4">
            <div className="flex items-center justify-between">
              <h4 className="text-dark-blue text-1xl pr-2 font-bold">
                {session.user.name}
              </h4>
              <h3 className="text-1xl font-bold text-dark-blue text-right">
                {session.department_code}
              </h3>
            </div>
          </div>
          <button className="text-sky-600 font-bold" onClick={() => signOut()}>
            Sign Out
          </button>
        </>
      ) : (
        <button className="text-purple-700" onClick={() => signIn()}>
          Sign In
        </button>
      )}
    </div>
  );
};

export default LoginInfo;
