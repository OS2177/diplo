import { Link } from "wouter";
import AuthButton from './components/AuthButton'; // Import AuthButton

export default function NavBar({ user, setUser }) { // Add user and setUser props
  return (
    <nav>
      <div className="flex items-center gap-4"> {/* Added div for better styling */}
        <AuthButton user={user} setUser={setUser} /> {/* Render AuthButton */}
      </div>
    </nav>
  );
}