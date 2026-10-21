import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  let content = <Outlet />;
  if (loading) content = <p>Đang tải...</p>;
  else if (error) content = <p>{error}</p>;

  return (
    <div>
      <NavBar />
      {content}
    </div>
  );
};

export default Layout;
