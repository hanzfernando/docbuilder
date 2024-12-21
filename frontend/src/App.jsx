import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';

// Import Auth Context Hook
import { useAuthContext } from './hooks/useAuthContext';
// Import Layouts

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
// Import Pages

import LoginPage from './pages/LoginPage';
import SuperAdminAdminsPage from './pages/SuperAdminAdminsPage.jsx';
import SuperAdminOrganizationsPage from './pages/SuperAdminOrganizationsPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminTemplatesPage from './pages/AdminTemplatesPage.jsx';
import AdminTemplateCreationPage from './pages/AdminTemplateCreationPage.jsx';
// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuthContext();
    console.log(user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Router Configuration
const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* Public Routes with AuthLayout */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Route>

                {/* Protected SuperAdmin Routes */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="superadmin">
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admins" element={<SuperAdminAdminsPage />} />
                    <Route path="/organizations" element={<SuperAdminOrganizationsPage />} />
                </Route>

                {/* Protected SuperAdmin Routes */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/templates" element={<AdminTemplatesPage />} />
                    <Route path="/template-creation" element={<AdminTemplateCreationPage />} />
                </Route>
            </>
        )
    );

    return <RouterProvider router={router} />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node,
    requiredRole: PropTypes.string,
};

export default App;
