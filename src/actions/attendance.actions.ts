"use server"

import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { TAttendance } from "@/lib/schema/attendance.schema";
import { TPunch } from "@/lib/schema/punch.schema";
import { Attendance, Punch } from "@prisma/client";

// ATTENDANCE WITH RELATION TYPE
export type AttendanceWithRelations = Attendance & {
  punch: Punch[]
}

// MARK ATTENDANCE
export async function markAttendance({
  punchData,
  attendanceData,
  employeeEmail,
}: {
  punchData: TPunch;
  attendanceData: TAttendance;
  employeeEmail: string;
}): Promise<Response> {
  try {
    const result: { status: "error" | "success"; message: string } =
      await prisma.$transaction(async (tx) => {

        // 1. FIND EMPLOYEE WITH GIVEN EMAIL
        const employee = await tx.employee.findFirst({
          where: {
            email: employeeEmail
          },
          select: {
            id: true
          }
        });

        if (!employee) {
          return {
            status: "error",
            message: "Employee with this email does not exist",
          };
        }

        // 2. IF EMPLOYEE EXISTS, CREATE ATTENDANCE FOR EMPLOYEE
        const attendance = await tx.attendance.create({
          data: {
            ...attendanceData,
            employeeId: employee.id
          }
        });

        if (!attendance) {
          return {
            status: "error",
            message: "Attendance marking failed",
          };
        }

        // 3. IF ATTENDANCE IS MARKED, ATTACH PUNCH TO ATTENDANCE
        const punch = await tx.punch.create({
          data: {
            ...punchData,
            attendanceId: attendance.id
          }
        });

        if (!punch) {
          return {
            status: "error",
            message: "Attendance marking failed",
          };
        }

        return {
          status: "success",
          message: "Attendance marked successfully",
        };
      });

    if (result.status == 'success') {
      return Response.success(undefined, "Attendance marked successfully");
    }

    return Response.error(result.message);
  } catch (error) {
    console.log(`ATTENDANCE_ACTION/MARK_ATTENDANCE: ${(error as Error).message}`);
    if (process.env.NODE_ENV == "development") {
      return Response.error((error as Error).message);
    }
    return Response.error("An error occurred while marking the attendance");
  }
}

// GET EMPLOYEE ATTENDANCE
// export async function getLocations(employeeId: string): Promise<Response<Location[]>> {
//   try {
//     const locations = await prisma.location.findMany({
//       where: {
//         employeeId: employeeId
//       }
//     });

//     return Response.success(locations);
//   } catch (error) {
//     console.log(`LOCATION_ACTION/GET_EMPLOYEE_LOCATIONS: ${(error as Error).message}`);
//     if (process.env.NODE_ENV == "development") {
//       return Response.error((error as Error).message);
//     }
//     return Response.error("An error occurred while fetching employee locations");
//   }
// }
