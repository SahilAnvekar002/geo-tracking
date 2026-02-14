import { AttendanceWithRelations } from "@/actions/attendance.actions";
import { Punch } from "@prisma/client";

export const formatMinutes = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} hrs ${m} mins`;
};

export const getMonthlyTableData = (
  attendance: AttendanceWithRelations[],
  selectedDate: Date
) => {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  return attendance
    .filter((att) => {
      const d = new Date(att.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .map((att) => {
      const punchIn = att.punch.find((p: Punch) => p.type === "IN");
      const punchOut = att.punch.find((p: Punch) => p.type === "OUT");

      return {
        date: new Date(att.createdAt).toLocaleDateString("en-GB"),

        punchIn: punchIn
          ? new Date(punchIn.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "-",

        punchOut: punchOut
          ? new Date(punchOut.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "-",

        workingHours: formatMinutes(att.totalWorkMinutes),
        overtimeHours: formatMinutes(att.overtimeMinutes),

        leaveStatus:
          att.leaveStatus === "NONE"
            ? "Present"
            : att.leaveStatus,
      };
    });
};
