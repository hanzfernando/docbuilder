import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const SideNavigationBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const navigate = useNavigate();

    // Define navigation items based on roles
    const navItems = {
        superadmin: [
            { name: 'Admins', path: '/admins' },
            { name: 'Organizations', path: '/organizations' },
        ]
        ,
        admin: [
            { name: 'Users', path: '/users' },
            { name: 'Templates', path: '/templates' },
        ]
        // ,
        // user: [
        //     { name: 'Profile', path: '/profile' },
        //     { name: 'Documents', path: '/documents' },
        // ],
    };

    const items = navItems[user?.role] || [];

    const handleLogout = () => {
        logout(); // Perform logout
        navigate('/login'); // Redirect to login
    };

    return (
        <nav className="flex flex-col h-full">
            <ul className="mb-auto">
                {items.map((item) => (
                    <li key={item.path} className="mb-4">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `block p-2 rounded ${
                                    isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
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
