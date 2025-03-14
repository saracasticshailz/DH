import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//  import { useAppStore } from '@/store';
import { IS_FAKE_LOGIN } from '@/config';
import { sessionStorageDelete } from '@/utils/sessionStorage';
import { useAppDispatch, useAppSelector } from './redux';
import { logout, selectAuth } from '@/store/slices/CustomerAuthSlice';

type CurrentUser = {
  id?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  name?: string;
};

/**
 * Hook to get currently logged user
 * @returns {object | undefined} user data as object or undefined if user is not logged in
 */
// export function useCurrentUser(): CurrentUser | undefined {
//   const [state] = useAppStore();
//   return state.currentUser as CurrentUser;
// }

/**
 * Hook to detect is current user authenticated or not
 * @returns {boolean} true if user is authenticated, false otherwise
 */
export function useIsAuthenticated() {
  const state = useAppSelector(selectAuth);

  const result = state.isAuthenticated;

  // TODO: AUTH: add access token verification or other authentication check here
  // result = Boolean(sessionStorageGet('access_token', ''));

  return result;
}

/**
 * Returns event handler to Logout current user
 * @returns {function} calling this event logs out current user
 */
export function useEventLogout() {
  const navigate = useNavigate();
  const state = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  return useCallback(() => {
    // TODO: AUTH: add auth and tokens cleanup here
    sessionStorageDelete('access_token');

    dispatch(logout());
    navigate('/Login', { replace: true });
  }, [dispatch, navigate]);
}

/**
 * Adds watchdog and calls different callbacks on user login and logout
 * @param {function} afterLogin callback to call after user login
 * @param {function} afterLogout callback to call after user logout
 */
export function useAuthWatchdog(afterLogin: () => void, afterLogout: () => void) {
  const state = useAppSelector(selectAuth);

  useEffect(() => {
    if (state.isAuthenticated) {
      afterLogin?.();
    } else {
      afterLogout?.();
    }
  }, [state.isAuthenticated, afterLogin, afterLogout]);
}
