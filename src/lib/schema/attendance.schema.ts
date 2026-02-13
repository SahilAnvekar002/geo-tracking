import { LeaveStatus } from "@prisma/client";
import z from "zod";

export const attendanceSchema = z.object({
  lateInReason: z.string().optional(),
  earlyOutReason: z.string().optional(),
  leaveStatus: z.enum(LeaveStatus),
});

export type TAttendance = z.infer<typeof attendanceSchema>;