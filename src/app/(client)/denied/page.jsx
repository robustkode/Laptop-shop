import Link from "next/link";

export default function Denied() {
  return (
    <main className="min-h-[70vh] grid place-items-center">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-2xl font-oswald">You are not authorized.</h1>
        <Link href="/" className="text-primary">Home</Link>
      </div>
    </main>
  );
}
