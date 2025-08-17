import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const location = useLocation()
  const currentPath = location.pathname;
  const isRegisterPage = currentPath === "/register" ? true : false;

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">IRAS</Link>
      <div>
        {user ? (
          <>
            <Link to="/inventory" className="mr-4">Inventory</Link>
            <Link to="/alerts" className="mr-4">Alerts</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) :
          isRegisterPage ?
            (<Link
              to="/login"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Login
            </Link>
            )
            :
            (<>
              <Link
                to="/register"
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
              >
                Register
              </Link>
            </>
            )

        }
      </div>
    </nav>
  );
};

export default Navbar;
