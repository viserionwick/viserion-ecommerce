// Essentials
import { Link, NavLink } from "react-router-dom"

// Contexts
import { useAuthContext } from "../../../contexts/Auth";

const D_MENU = () => {

  // Read User Permissions
  const { userRoleAccess } = useAuthContext();
  /* const [userRoleAccess] = useAtom(userRoleAccess_atom); */

  return (
    <div className="p-dashboard__menu">
      <div className="p-dashboard__menu--wrapper">
        <div className="p-dashboard__menu--header">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/">Website</Link>
        </div>
        <div className="p-dashboard__menu--content">
          {
            userRoleAccess.products || userRoleAccess.orders || userRoleAccess.analytics ?
            <div>
              <h1>Content</h1>
              { userRoleAccess.products && <NavLink to="/dashboard/products">Products</NavLink>}
              { userRoleAccess.orders && <NavLink to="/dashboard/orders">Orders</NavLink>}
              { userRoleAccess.analytics && <NavLink to="/dashboard/analytics">Analytics</NavLink> }
            </div>
            : null
          }

          {
            userRoleAccess.users || userRoleAccess.roles ?
            <div>
              <h1>People</h1>
              { userRoleAccess.users && <NavLink to="/dashboard/users">Users</NavLink>}
              { userRoleAccess.roles && <NavLink to="/dashboard/roles">Roles</NavLink>}
            </div>
            : null
          }

          {
            userRoleAccess.design || userRoleAccess.pages ?
            <div>
              <h1>Website</h1>
              { userRoleAccess.design && <NavLink to="/dashboard/design">Design</NavLink>}
              { userRoleAccess.pages && <NavLink to="/dashboard/pages">Pages</NavLink>}
            </div>
            : null
          }
        </div>
      </div>
    </div>
  )
}

export default D_MENU