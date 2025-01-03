import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/SideNavigationBar.jsx';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/5 bg-white shadow-md p-4 max-w-256">
                <SideNavigationBar />
            </div>

            {/* Main Content */}
            <div className="w-4/5 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
