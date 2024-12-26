import PropTypes from 'prop-types';
import { AuthProvider } from './AuthContext';
import { OrganizationProvider } from './OrganizationContext';
import { UserProvider } from './UserContext';
import { TemplateProvider } from './TemplateContext';
import { DocumentProvider } from './DocumentContext';
const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <UserProvider>
                <OrganizationProvider>
                    <TemplateProvider>
                        <DocumentProvider>
                        {children}
                        </DocumentProvider>
                    </TemplateProvider>
                </OrganizationProvider>
            </UserProvider> 
        </AuthProvider>
    );
};

export default AppProvider;

AppProvider.propTypes = {
    children: PropTypes.node,
}
