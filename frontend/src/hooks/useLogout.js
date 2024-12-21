import { useAuthContext } from './useAuthContext';
import { useUserContext } from './useUserContext';
import { useOrganizationContext } from './useOrganizationContext';
import { removeToken } from '../utils/authUtil';

const useLogout = () => {
    const { dispatch: authDispatch } = useAuthContext();
    const { dispatch: userDispatch } = useUserContext();
    const { dispatch: orgDispatch } = useOrganizationContext();

    const logout = () => {
        // Clear token from storage
        removeToken();

        // Dispatch logout actions to clear all contexts
        authDispatch({ type: 'LOGOUT' });
        userDispatch({ type: 'LOGOUT' });
        orgDispatch({ type: 'LOGOUT' });
    };

    return { logout };
};

export { useLogout };
