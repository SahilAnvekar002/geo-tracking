"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User2Icon } from "lucide-react";

export function EmployeeActions({
  employeeId,
}: {
  employeeId: string;
}) {
  const router = useRouter();
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        className="cursor-pointer"
        size={"icon"}
        onClick={() => router.push(`/dashboard/${employeeId}`)}
      >
        <User2Icon />
      </Button>
    </div>
  );
}
