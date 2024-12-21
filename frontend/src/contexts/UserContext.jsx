import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.payload, loading: false, error: null };
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        case 'REMOVE_USER':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.payload),
            };
        case 'LOGOUT':
            return {
                users: [],
                loading: false,
                error: null,
            }; // Reset user state on logout
        default:
            return state;
    }
};

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
