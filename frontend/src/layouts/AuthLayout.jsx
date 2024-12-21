import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Side - Illustration or Branding */}
            <div className="w-1/2 bg-blue-500 text-white flex items-center justify-center">
                <h1 className="text-4xl font-bold">Welcome Back!</h1>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
