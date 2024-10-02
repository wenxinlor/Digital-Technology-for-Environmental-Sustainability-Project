"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import malls from "./malls.json";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsPage = () => {
  const router = useRouter();
  const [mall, setMall] = useState("");
  const [mallData, setMallData] = useState({} as any);
  const [tenant, setTenant] = useState("");
  const [tenantData, setTenantData] = useState({} as any);
  const [mallList, setMallList] = useState([] as any);
  const [viewTenants, setViewTenants] = useState(false);

  useEffect(() => {
    // get list of mall id and names
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/get_list_of_malls")
      .then((res: any) => {
        setMallList(res.data.malls);
      });
  }, []);

  useEffect(() => {
    //get data for a mall

    if (mall.length > 0) {
      axios
        .get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/get_mall_data_by_id/" + mall
        )
        .then((res: any) => {
          if (res.status === 200) {
            console.log(res.data);
            const data = Object.keys(res.data.mall_waste_stream).map(
              (wasteStream: string) => {
                console.log(wasteStream);
                return {
                  name: wasteStream,
                  value:
                    res.data.mall_waste_stream[
                      wasteStream as keyof typeof res.data.mall_waste_stream
                    ],
                };
              }
            );
            data.sort((a: any, b: any) => b.value - a.value);
            setMallData({ ...res.data, mall_waste_stream: data });
          }
        });
    }
  }, [mall]);

  useEffect(() => {
    // get tenant data when tenant is selected
    if (tenant.length > 0) {
      axios
        .get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            "/get_tenant_data_by_id/" +
            mall +
            "/" +
            tenant
        )
        .then((res: any) => {
          if (res.status === 200) {
            const data = Object.keys(res.data.tenant_waste_stream).map(
              (wasteStream: string) => {
                return {
                  name: wasteStream,
                  value:
                    res.data.tenant_waste_stream[
                      wasteStream as keyof typeof res.data.tenant_waste_stream
                    ],
                };
              }
            );
            data.sort((a: any, b: any) => b.value - a.value);
            setTenantData({ ...res.data, tenant_waste_stream: data });
          }
        });
    }
  }, [mall, tenant]);

  const getTenantData = () => {};

  const renderData = (data: any) => {
    return (
      <>
        <ResponsiveContainer width="100%" minWidth="20vh" minHeight="20vh">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Table className="w-full">
          <TableHeader>
            <TableRow className="w-full">
              <TableCell>
                <Label className="font-bold">Waste Type</Label>
              </TableCell>
              <TableCell className="text-end">
                <Label className="font-bold">Weight (kg)</Label>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <FontAwesomeIcon
                    icon={faCircle}
                    style={{ color: COLORS[index % COLORS.length] }}
                    className="mr-2"
                  />
                  {row.name}
                </TableCell>
                <TableCell className="text-end">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                <Label className="font-bold">Total</Label>
              </TableCell>
              <TableCell className="text-end">
                <Label className="font-bold">
                  {data
                    .reduce((acc: number, cur: any) => acc + cur.value, 0)
                    .toFixed(2)}
                </Label>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Button
          className="w-full"
          hidden={tenant?.length > 0}
          onClick={() => {
            viewTenants ? setViewTenants(false) : setViewTenants(true);
          }}
        >
          View {viewTenants ? "Mall" : "Tenants"}
        </Button>
      </>
    );
  };

  return (
    <div className="mx-4">
      <div className="shadow-paper w-full rounded-lg bg-navy text-white">
        <div className="mb-4 flex flex-row items-center justify-between h-[8vh] p-6">
          <div className="title font-medium text-xl">Dashboard</div>
        </div>
      </div>

      {viewTenants && (
        <div className="flex flex-col gap-4 bg-white shadow-paper rounded-lg p-4">
          <div className="text-lg">
            <span className="font-bold">Mall:</span> {mallData.mall_name}
          </div>

          <div>
            <Label className="font-bold">Tenant: </Label>
            <Select
              onValueChange={(tenantId) => {
                setTenant(tenantId);
                // setViewTenants(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Tenant" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(mallData.tenants).map((tenantId: string) => {
                  return (
                    <SelectItem key={tenantId} value={tenantId}>
                      {mallData.tenants[tenantId]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {
            // render tenant data if tenantData is not empty
            Object.keys(tenantData).length > 0 && renderData(tenantData.tenant_waste_stream)
          }
        </div>
      )}

      {!viewTenants && (
        <div className="flex flex-col gap-4 bg-white shadow-paper rounded-lg p-4">
          <div>
            <Label className="font-bold">Mall: </Label>
            <Select
              onValueChange={(mallId) => {
                setMall(mallId);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Mall" />
              </SelectTrigger>
              <SelectContent>
                {mallList &&
                  mallList?.map((mall: any) => {
                    return (
                      <SelectItem key={mall.mall_id} value={mall.mall_id}>
                        {mall.mall_name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          {
            // render mall data if mallData is not empty
            Object.keys(mallData).length > 0 &&
              renderData(mallData.mall_waste_stream)
          }
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
