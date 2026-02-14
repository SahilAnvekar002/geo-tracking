"use client";

import { EmployeeWithRelations } from "@/actions/employee.actions";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, LogOut, Mail, Phone, User } from "lucide-react";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { generateEmployeeMonthlyReport } from "@/lib/reports/employee_report";
import { AttendanceWithRelations } from "@/actions/attendance.actions";
import { toast } from "sonner";
import { ReportTable } from "../report/table/report.table";
import { getMonthlyTableData } from "@/utils/generateMonthlyReport";

const EmployeeDetails = ({
  employee,
}: {
  employee: EmployeeWithRelations;
}) => {
  // default → current month
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());

  // Constant
  const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
  ];

  // Extract year and month from selected value like "2026-02".
  const { workingMinutes, overtimeMinutes, fullLeaves, halfLeaves } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed

    let workingMinutes = 0;
    let overtimeMinutes = 0;
    let fullLeaves = 0;
    let halfLeaves = 0;

    employee.attendance.forEach((att) => {
      const date = new Date(att.createdAt);

      if (date.getFullYear() === year && date.getMonth() === month) {
        workingMinutes += att.totalWorkMinutes || 0;
        overtimeMinutes += att.overtimeMinutes || 0;

        if (att.leaveStatus === "FULL") fullLeaves++;
        if (att.leaveStatus === "HALF") halfLeaves++;
      }
    });

    return { workingMinutes, overtimeMinutes, fullLeaves, halfLeaves };
  }, [employee.attendance, selectedDate]);


  // Convert Hours to Minutes
  const formatMinutes = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const remaining = mins % 60;
    return `${hrs} hrs ${remaining} min`;
  };

  // Month Selector
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(pickerYear, monthIndex, 1);
    setSelectedDate(newDate);
  };

  // Generate Report
  const generateReport = async (
    employee: EmployeeWithRelations,
    selectedDate: Date
  ) => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const monthlyAttendance = employee.attendance.filter((att: AttendanceWithRelations) => {
      const d = new Date(att.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    if (!monthlyAttendance.length) {
      toast.error("No attendance found for selected month");
      return;
    }
    generateEmployeeMonthlyReport(employee, selectedDate);
  }

  // Monthly Report Data
  const monthlyReports = useMemo(() => {
    return getMonthlyTableData(employee.attendance, selectedDate);
  }, [employee.attendance, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="relative bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Details</h1>
              <p className="text-gray-600">Complete information about {employee.firstName + " " + employee.lastName}</p>
            </div>
          </div>

          {/* Employee Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">{employee.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{employee.email ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{employee.designation ?? '-'}</p>
              </div>
            </div>
          </div>

          {/* Month Selector Button */}
          <div className="absolute top-2 right-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-55 justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMMM yyyy")}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-72">
                {/* Year Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPickerYear((y) => y - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>

                  <span className="font-semibold">{pickerYear}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPickerYear((y) => y + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {months.map((month, index) => {
                    const isSelected =
                      selectedDate.getMonth() === index &&
                      selectedDate.getFullYear() === pickerYear;

                    return (
                      <Button
                        key={month}
                        variant={isSelected ? "default" : "outline"}
                        className="h-9"
                        onClick={() => handleMonthSelect(index)}
                      >
                        {month}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Employee Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-2">Working Hours</p>
                  <p className="text-2xl font-bold text-blue-800">{formatMinutes(workingMinutes)}</p>
                </div>
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium mb-2">Overtime Hours</p>
                  <p className="text-2xl font-bold text-yellow-800">{formatMinutes(overtimeMinutes)}</p>
                </div>
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-2">Full Leaves</p>
                  <p className="text-2xl font-bold text-green-800">{fullLeaves}</p>
                </div>
                <LogOut className="text-green-600" size={24} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-2">Half Leaves</p>
                  <p className="text-2xl font-bold text-purple-800">{halfLeaves}</p>
                </div>
                <LogOut className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily Report</h1>
            <Button
              variant='outline'
              onClick={() => generateReport(employee, selectedDate)}
            >
              Generate Report
            </Button>
          </div>
          {/* <EmployeeLocationCalendar attendance={employee.attendance} selectedDate={selectedDate} /> */}
          <ReportTable reports={monthlyReports} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;