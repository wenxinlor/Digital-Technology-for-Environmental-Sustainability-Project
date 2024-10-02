"use client";

import { useEffect, useState } from "react";
import BarcodeScanner from "@/components/barcodeScanner";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const BarcodeScannerPage = () => {
  const router = useRouter();
  const [barcode, setBarcode] = useState("");
  const [details, setDetails] = useState({} as any);
  const [input, setInput] = useState("");

  const onNewScanResult = (decodedText: string, decodedResult: string) => {
    console.log("Barcode: ", decodedText);
    setBarcode(decodedText);
  };

  useEffect(() => {
    if (barcode.split("-").length === 3) {
      let [mall_id, tenant_id, waste_id] = barcode.split("-");
      axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/verify_barcode/" + barcode)
        .then((res: any) => {
          if (res.status === 200) {
            setDetails(res.data.data);
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toast.error("Invalid barcode!");
          } else {
            toast.error("Error verifying barcode!");
          }
        });
    }
  }, [barcode]);

  useEffect(() => {
    if (details.mall_name && details.tenant_name && details.waste_stream) {
      let data = {
        barcode: barcode,
        mallName: details.mall_name,
        storeName: details.tenant_name,
        wasteStream: details.waste_stream,
      };
      const params = new URLSearchParams(data);
      router.push(`/input-weight?${params.toString()}`);
      // set data in router
    }
  }, [barcode, details, router]);

  return (
    <div className="mx-4">
      <div className="shadow-paper w-full rounded-lg bg-navy text-white">
        <div className="mb-4 flex flex-row items-center justify-between h-[8vh] p-6">
          <div className="title font-medium text-xl">Barcode Scanner</div>
        </div>
      </div>

      <div>
        <div>
          <BarcodeScanner
            fps={10}
            qrbox={250}
            disableFlip={true}
            qrCodeSuccessCallback={onNewScanResult}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white shadow-paper rounded-lg p-4">
        <Label>Barcode:</Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="or enter barcode manually here..."
        ></Input>
        <Button
          onClick={() => {
            setBarcode(input);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScannerPage;
