
import { Link } from "wouter";

export default function NavBar() {
  return (
    <nav className="bg-neutral-900 text-white py-4 px-6">
      <div className="container mx-auto flex gap-6">
        <Link href="/">
          <a className="hover:text-primary-light">Home</a>
        </Link>
        <Link href="/create-campaign">
          <a className="hover:text-primary-light">Propose</a>
        </Link>
        <Link href="/integrity-vote">
          <a className="hover:text-primary-light">Integrity</a>
        </Link>
        <Link href="/dashboard">
          <a className="hover:text-primary-light">Dashboard</a>
        </Link>
        <Link href="/results">
          <a className="hover:text-primary-light">Archive</a>
        </Link>
      </div>
    </nav>
  );
}
