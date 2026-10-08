import Link from "next/link";
import { Critter } from "@/components/Critter";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
      <Critter id="ollie" mood="think" size={150} />
      <h1 className="text-4xl font-bold">Oops! This page swam away.</h1>
      <Link href="/" className="btn btn-good min-h-16 px-8 text-2xl">
        Go home
      </Link>
    </main>
  );
}
