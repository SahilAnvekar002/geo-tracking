"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ReportType } from "./report.table";

export const reportColumns: ColumnDef<ReportType>[] =
  [
    {
      id: "date",
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.date}</div>,
    },
    {
      id: "punchIn",
      accessorKey: 'punchIn',
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Punch In
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.punchIn}</div>,
    },
    {
      id: "punchOut",
      accessorKey: 'punchOut',
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Punch Out
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.punchOut}</div>,
    },
    {
      id: "workingHours",
      accessorKey: "workingHours",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Working Hours
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.workingHours}</div>,
    },
    {
      id: "overtimeHours",
      accessorKey: "overtimeHours",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Overtime Hours
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.overtimeHours}</div>,
    },
    {
      id: "status",
      accessorKey: "leaveStatus",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Leave Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.leaveStatus}</div>,
    }
  ];
