import { getEmployeeAttendance } from "@/actions/attendance.actions";
import LoginEmployeeForm from "@/components/employee/forms/loginEmployeeForm";
import PunchEmployee from "@/components/employee/forms/punchEmployee";
import { cookies } from "next/headers";

export default async function page() {
  const cookieStore = await cookies();
  const employeeId = cookieStore.get("employeeId")?.value;

  if (employeeId) {
    const response = await getEmployeeAttendance(employeeId);

    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <PunchEmployee employeeId={employeeId} attendance={response.data} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginEmployeeForm />
        </div>
      </div>
    )
  }
}
