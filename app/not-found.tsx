import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <div className="dog-illustration">🐕</div>
      <h1>Sorry! We couldn't find that page.</h1>
      <p>Try searching or return to the Amazon home page.</p>
      <Link className="yellow-button" href="/">
        Amazon home
      </Link>
    </div>
  );
}
