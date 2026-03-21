import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { getDifficultKeys, getUserDailyStats } from "@/app/actions/progress";
import { DifficultKeysClient } from "./DifficultKeysClient";

export default async function DifficultKeysPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [charErrors, dailyStats] = await Promise.all([
    getDifficultKeys('deseti-prsty'),
    getUserDailyStats(),
  ]);

  return (
    <AppLayout dailyStats={dailyStats}>
      <DifficultKeysClient charErrors={charErrors} />
    </AppLayout>
  );
}
