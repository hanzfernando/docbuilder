import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import ic_system from '../assets/ic_sys.png';

const SideNavigationBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    // Define navigation items based on roles
    const navItems = {
        superadmin: [
            { name: 'Admins', path: '/admins' },
            { name: 'Organizations', path: '/organizations' },
        ],
        admin: [
            { name: 'Users', path: '/users' },
            { name: 'Templates', path: '/templates' },
        ],
        organization: [
            { name: 'Templates', path: '/user-templates' },
            { name: 'Documents', path: '/documents' },
        ],
        student: [
            { name: 'Templates', path: '/user-templates' },
            { name: 'Documents', path: '/documents' },
        ],
    };

    const items = navItems[user?.role] || [];

    const handleLogout = () => {
        logout(); // Perform logout
    };

    return (
        <nav className="flex flex-col h-full p-2">
            {/* Top Section: Icon and User Info */}
            <div className="flex items-center mb-6">
                <img src={ic_system} alt="System Icon" className="w-12 h-12 mr-4" />
                <div>
                    <p className="text-md font-bold text-gray-700">
                        {user?.firstname} {user?.lastname}{' '}
                        {user?.organization ? `(${user.organization.name})` : ''}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
            </div>

            {/* Navigation Items */}
            <ul className="mb-auto">
                {items.map((item) => (
                    <li key={item.path} className="mb-4">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `block p-2 rounded ${
                                    isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Change Password Link */}
            <NavLink
                to="/change-password"
                className={({ isActive }) =>
                    `block p-2 text-blue-600 hover:bg-blue-100 rounded mb-2 text-center ${
                        isActive ? 'font-bold' : ''
                    }`
                }
            >
                Change Password
            </NavLink>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="block p-2 text-red-600 hover:bg-red-100 rounded"
            >
                Logout
            </button>
        </nav>
    );
};

export default SideNavigationBar;
