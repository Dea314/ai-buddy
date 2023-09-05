import prismadb from "@/lib/prismadb";
import { BuddyForm } from "./components/buddy-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface BuddyIdPageProps {
  params: {
    buddyId: string;
  };
}

const BuddyIdPage = async ({ params }: BuddyIdPageProps) => {
  const { userId } = auth();

  if (!userId) return redirectToSignIn();

  const buddy = await prismadb.buddy.findUnique({
    where: {
      id: params.buddyId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany();

  return <BuddyForm initialData={buddy} categories={categories} />;
};

export default BuddyIdPage;
