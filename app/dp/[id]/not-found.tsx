import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Looking for something?</h1>
      <p>We're sorry. The product you requested is no longer available.</p>
      <Link className="yellow-button" href="/">
        Go to Amazon home
      </Link>
    </div>
  );
}
