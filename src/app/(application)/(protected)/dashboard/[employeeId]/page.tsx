import { getEmployeeById } from "@/actions/employee.actions";
import EmployeeDetails from "@/components/employee/employeeDetails";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ employeeId: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const { employeeId } = await params;
  const employeeResponse = await getEmployeeById(employeeId);

  if (employeeResponse.status == "OK" && employeeResponse.data) {
    return (
      <EmployeeDetails employee={employeeResponse.data} />
    );
  } else {
    return (
      <div className="flex flex-col justify-center lg:flex-row items-center gap-4 flex-1/2">
        <p>Employee not found</p>
      </div>
    );
  }
}
