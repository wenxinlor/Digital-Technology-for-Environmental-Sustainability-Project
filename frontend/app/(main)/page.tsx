"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Home() {
  const [audits, setAudits] = useState([]) as any;

  useEffect(() => {
    // get all audits
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/audit_statuses")
      .then((res) => {
        console.log(res);
        setAudits(res.data.audit_statuses);
      });
  }, []);

  return (
    <div className="mx-4">
      <div className="shadow-paper w-full rounded-lg bg-navy text-white">
        <div className="mb-4 flex flex-row items-center justify-between h-[8vh] p-6">
          <div className="title font-medium text-xl">Waste Auditing App</div>
        </div>
      </div>

      <div className="overflow-x-auto flex bg-white shadow-paper rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit ID</TableHead>
              <TableHead>Mall Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits?.map((audit: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium min-w-[100px]">
                  {audit.audit_id}
                </TableCell>
                <TableCell className="min-w-[180px]">
                  {audit.mall_name}
                </TableCell>
                <TableCell className="min-w-[200px] flex gap-2">
                  <Badge
                    variant={
                      audit.audit_status === "Completed"
                        ? "success"
                        : audit.audit_status === "Incomplete"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {audit.audit_status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
