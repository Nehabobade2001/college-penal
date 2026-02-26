/**
 * usePermissions — thin wrapper over PermissionsContext.
 *
 * Returns:
 *   null            → still loading (show skeleton / spinner)
 *   string[]        → list of allowed apiRoutes for this user
 *
 * Admin users always get `null` returned from the context BUT
 * `isAdmin` will be true — the Sidebar uses isAdmin to bypass filtering.
 *
 * NOTE: No localStorage or sessionStorage is used.
 *       Permissions are fetched fresh from /auth/profile on every page load.
 */
export { usePermissionsContext as usePermissions } from '@/context/PermissionsContext'