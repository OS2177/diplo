
import { Link } from "wouter";
import AuthButton from './AuthButton'; // Fixed import path

export default function NavBar({ user, setUser }) {
  return (
    <nav>
      <div className="flex items-center gap-4">
        <AuthButton user={user} setUser={setUser} />
      </div>
    </nav>
  );
}
