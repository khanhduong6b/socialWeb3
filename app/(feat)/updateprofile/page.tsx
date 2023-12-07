import AccountProfile from "@/components/forms/AccountProfile";
import UpdateProfile from "@/components/forms/UpdateProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() {
  return (
    <main className="mx-auto flex max-w-3x1 flex-col justify-start px-10 ">
      <h1 className="head-text">Update Profile</h1>

      <section className="mt-9 bg-dark-2 px-10 py-3">
        <UpdateProfile />
      </section>
    </main>
  );
}

export default Page;
