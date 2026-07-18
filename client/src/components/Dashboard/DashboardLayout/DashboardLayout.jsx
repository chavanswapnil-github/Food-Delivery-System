import "./DashboardLayout.css";
import Sidebar from "../Sidebar/Sidebar";

function DashboardLayout({ children, sidebar }) {
  return (
    <div className="dashboard">

      {sidebar || <Sidebar />}

      <main className="dashboard-content">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;