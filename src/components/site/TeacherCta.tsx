import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { teacherPath, TEACHER_SIGNUP } from "./teachers";

/** The closing call to action on teacher pages: create an account, or read how classes work. */
export function TeacherCta({ showHub = true }: { showHub?: boolean }) {
  return (
    <section aria-labelledby="teacher-cta" className="card mt-10 flex flex-col gap-3 p-6">
      <h2 id="teacher-cta" className="text-2xl font-bold">
        Try {APP_NAME} with your class
      </h2>
      <p className="font-read text-ink-soft">Classes are free for now. Create a teacher account, share a join code with families and assign units in minutes.</p>
      <div className="flex flex-wrap gap-3">
        <Link href={TEACHER_SIGNUP} className="btn btn-good min-h-14 px-8 text-xl">
          Create a free teacher account
        </Link>
        {showHub && (
          <Link href={teacherPath.hub()} className="btn min-h-14 px-6 text-lg">
            How classes work
          </Link>
        )}
      </div>
    </section>
  );
}
