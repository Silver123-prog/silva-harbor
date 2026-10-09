import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="panel">
      <h1>Page not found</h1>
      <p>That address doesn't lead anywhere. <Link to="/">Go to today's view</Link></p>
    </div>
  );
}
