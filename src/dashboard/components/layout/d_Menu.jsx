// Essentials
import { Link, NavLink } from "react-router-dom"


const D_MENU = () => {
  return (
    <div className="p-dashboard__menu">
      <div className="p-dashboard__menu--wrapper">
        <div className="p-dashboard__menu--header">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/">Website</Link>
        </div>
        <div className="p-dashboard__menu--content">
          <div>
            <h1>Content</h1>
            <NavLink to="/dashboard/products">Products</NavLink>
            <NavLink to="/dashboard/orders">Orders</NavLink>
            <NavLink to="/dashboard/analytics">Analytics</NavLink>
          </div>

          <div>
            <h1>People</h1>
            <NavLink to="/dashboard/users">Users</NavLink>
            <NavLink to="/dashboard/roles">Roles</NavLink>
          </div>

          <div>
            <h1>Website</h1>
            <NavLink to="/dashboard/design">Design</NavLink>
            <NavLink to="/dashboard/pages">Pages</NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default D_MENU