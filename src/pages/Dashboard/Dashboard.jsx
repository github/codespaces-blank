import { Link } from "react-router-dom";
import "./Dashboard.css";
const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <h1 className="has-text-centered mb-4">Welcome user</h1>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link">
              {" "}
              <Link to={"/login"} className="has-text-white">Logout</Link>
            </button>
          </div>
          <div class="control">
            <button class="button is-danger">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
