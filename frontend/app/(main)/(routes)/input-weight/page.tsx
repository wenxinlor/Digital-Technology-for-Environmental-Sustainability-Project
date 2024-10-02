"use client";

import { Button } from "@/components/ui/button";
import { faCaretLeft, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const BarcodeScannerPage = () => {
  const router = useRouter();
  const [timestamp, setTimestamp] = useState("");
  const [form, setForm] = useState({
    mall_id: "",
    tenant_id: "",
    waste_id: "",
    weight: "",
  });
  const [mallName, setMallName] = useState("Mall");
  const [storeName, setStoreName] = useState("Store");
  const [wasteType, setWasteType] = useState("Waste Type");
  const params = useSearchParams();
  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
    const [mall_id, tenant_id, waste_id] = params
      .get("barcode")
      ?.split("-") as string[];
    const mallName = params.get("mallName") as string;
    const storeName = params.get("storeName") as string;
    const wasteType = params.get("wasteStream") as string;
    setMallName(mallName);
    setStoreName(storeName);
    setWasteType(wasteType);

    setForm({
      mall_id: mall_id || "",
      tenant_id: tenant_id || "",
      waste_id: waste_id || "",
      weight: "",
    });
  }, [params]);

  const submitFormHandler = () => {
    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/add_scanned_entry", form)
      .then((res: any) => {
        if (res.status === 201) {
          toast.success("Entry submitted successfully!");
          setTimeout(() => {
            router.push(`/barcode-scanner`);
          }, 2000);
        } else {
          console.error("Error submitting data");
          toast.error("Error submitting data");
        }
      });
    // router.push(`/history`);
  };

  return (

    <div className="mx-4">
      <div className="shadow-paper w-full rounded-lg bg-navy text-white">
        <div className="mb-4 flex flex-row items-center justify-between h-[8vh] p-6">
          <div className="title font-medium text-xl">
            <FontAwesomeIcon
              icon={faCaretLeft}
              className="w-4 h-4 mr-2"
              onClick={() => router.push("/barcode-scanner")}
            />
            Input Weight
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-white shadow-paper rounded-lg p-6 text-xl font-medium">
        <div>
          <span className="font-semibold">Mall:</span> {mallName}
        </div>
        <div>
          <span className="font-semibold">Tenant:</span> {storeName}
        </div>
        <div>
          <span className="font-semibold">Waste Type:</span> {wasteType}
        </div>
        {/* <div>
          <span className="font-semibold">Time Stamp:</span> {timestamp}
        </div> */}
        <div className="flex">
          <div className="font-semibold mr-2 align-text-bottom">Weight:</div>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="border-2 border-gray-300 rounded-md p-1 w-20"
          />{" "}
          kg
        </div>
        <Button variant="diamond" type="submit" onClick={submitFormHandler}>
          <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 mr-2" />
          Submit
        </Button>
      </div>
    </div>

  );
};

export default BarcodeScannerPage;
