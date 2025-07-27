import { Nav } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Header Section */}
      <div className="sidebar-header">
        <h1 className="firms-title">HRMS</h1>
        <div className="user-profile">
          <h2 className="user-name">Maria</h2>
          <p className="user-role">HR Manager</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="dashboard-section">
         <Nav className="flex-column">
          {['Dashboard','Chat', 'Employees', 'Feed', 'Recognition', 'Event', 'Profile', 'Settings'].map((item) => (
            <Nav.Link key={item} className="nav-item">
              {item}
            </Nav.Link>
          ))}
        </Nav>
      </div>
       </div>
         );
};

export default Sidebar;