"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import axios from "axios";
const BarcodeScannerPage = () => {
  const router = useRouter();
  const [history, setHistory] = useState([] as any);

  useEffect(() => {
    // get data from DB
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/get_scanned_entries")
      .then((res: any) => {
        if (res.status === 200) {
          setHistory(res.data.scanned_entries);
        }
      });
  }, []);

  const renderHistory = () => {};

  return (
    <div className="mx-4 max-h-full h-full">
      <div className="shadow-paper w-full rounded-lg bg-navy text-white">
        <div className="mb-4 flex flex-row items-center justify-between h-[8vh] p-6">
          <div className="title font-medium text-xl">History</div>
        </div>
      </div>
      <div className=" max-h-full h-full overflow-auto">
        {history?.length > 0 &&
          history.map((item: any, index: number) => {
            return (
              <div key={index} className="flex flex-col gap-4 bg-white shadow-paper rounded-lg p-4 text-xl font-medium my-2">
                <div
                  className="flex flex-col justify-between text-left"
                >
                  <div>
                    <Label className="font-bold">Mall: </Label>{" "}
                    <span className="font-medium text-sm">
                      {item.mall_name}
                    </span>
                  </div>
                  <div>
                    <Label className="font-bold">Tenant: </Label>{" "}
                    <span className="font-medium text-sm">
                      {item.tenant_name}
                    </span>
                  </div>
                  <div>
                    <Label className="font-bold">Recorded on: </Label>{" "}
                    <span className="font-medium text-sm">
                      {item.audit_date}
                    </span>
                    <div>
                      <span className="font-medium text-sm">
                        {item.waste_stream} {item.weight} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {/* <div className="h-50"></div> */}
      </div>
    </div>
  );
};

export default BarcodeScannerPage;
