import PropTypes from 'prop-types';
import { AuthProvider } from './AuthContext';
import { OrganizationProvider } from './OrganizationContext';
import { UserProvider } from './UserContext';
const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <UserProvider>
                <OrganizationProvider>
                    {children}
                </OrganizationProvider>
            </UserProvider> 
        </AuthProvider>
    );
};

export default AppProvider;

AppProvider.propTypes = {
    children: PropTypes.node,
}
