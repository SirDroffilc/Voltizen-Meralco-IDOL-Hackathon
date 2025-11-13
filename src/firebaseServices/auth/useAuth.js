import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Thin consumer hook for the AuthContext.
export default function useAuth() {
	return useContext(AuthContext);
}
