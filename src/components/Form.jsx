import { useEffect, useState } from "react";
import { prepareData } from "../lib/utils";
import { useAppStore } from "../lib/zustand";
import { addInvoice, updateById } from "../request";
import ItemList from "./ItemList";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Form({ info, setSheetOpen }) {
  const { items: zustandItems } = useAppStore();
  const {
    senderAddress,
    clientAddress,
    clientEmail,
    clientName,
    paymentTerms,
    description,
    paymentDue,
    createdAt,
    items,
  } = info || {};
  const navigate = useNavigate();
  const { updateInvoices } = useAppStore();
  const [sending, setSending] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = {};
    if (!info) {
      result.status = e.nativeEvent.submitter.id;
    }

    formData.forEach((value, key) => {
      if (key === "quantity" || key === "price" || key === "paymentTerms") {
        result[key] = Number(value);
      } else {
        result[key] = value;
      }
    });
    result.items = zustandItems;
    const readyData = prepareData(result);

    setSending({
      mode: e.nativeEvent.submitter.id === "edit" ? "edit" : "add",
      data: readyData,
    });
  }

  useEffect(() => {
    if (sending) {
      setLoading(true);
      if (sending.mode === "add") {
        addInvoice(sending)
          .then((res) => {
            updateInvoices(res);
            toast.success("Added successfully ✅");
            setSheetOpen(false);
          })
          .catch(({ message }) => {
            toast.error(message);
          })
          .finally(() => {
            setLoading(false);
            setSending(null);
          });
      } else if (sending.mode === "edit") {
        updateById(info.id, sending.data)
          .then((res) => {
            updateInvoices(res);
            toast.success("Edited successfully ✅");
            navigate(-1);
            setSheetOpen(false);
          })
          .catch(({ message }) => {
            toast.error(message);
          })
          .finally(() => {
            setLoading(false);
            setSending(null);
          });
      }
    }
  }, [sending ? JSON.stringify(sending) : sending]);

  return (
    <form onSubmit={handleSubmit} className="p-4 pt-14 ">
      {/* Bill From */}
      <div className="mb-10">
        <h3 className="text-2xl font-medium mb-5">Bill From</h3>
        <div className="flex flex-col gap-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="senderAddress-street">Street Address</Label>
            <Input
              type="text"
              defaultValue={info && senderAddress.street}
              id="senderAddress-street"
              name="senderAddress-street"
              placeholder="Street Address"
            />
          </div>
          <div className="flex justify-between gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="senderAddress-city">City</Label>
              <Input
                type="text"
                defaultValue={info && senderAddress.city}
                id="senderAddress-city"
                name="senderAddress-city"
                placeholder="City"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="senderAddress-postCode">Post Code</Label>
              <Input
                type="text"
                defaultValue={info && senderAddress.postCode}
                id="senderAddress-postCode"
                name="senderAddress-postCode"
                placeholder="Post Code"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="senderAddress-country">Country</Label>
              <Input
                type="text"
                defaultValue={info && senderAddress.country}
                id="senderAddress-country"
                name="senderAddress-country"
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}

      <div className="mb-10">
        <h3 className="text-2xl font-medium mb-5">Bill To</h3>
        <div className="flex flex-col gap-5 mb-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="clientEmail">Client's Email</Label>
            <Input
              type="text"
              id="clientEmail"
              name="clientEmail"
              defaultValue={info && clientEmail}
              placeholder="Client's Email"
            />
          </div>

          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="clientName">Client's Name</Label>
            <Input
              type="text"
              id="clientName"
              name="clientName"
              defaultValue={info && clientName}
              placeholder="Client's Name"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="clientAddress-street">Street Address</Label>
            <Input
              type="text"
              id="clientAddress-street"
              name="clientAddress-street"
              defaultValue={info && clientAddress.street}
              placeholder="Street Address"
            />
          </div>
          <div className="flex justify-between gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="clientAddress-city">City</Label>
              <Input
                type="text"
                id="clientAddress-city"
                name="clientAddress-city"
                defaultValue={info && clientAddress.city}
                placeholder="City"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="clientAddress-postCode">Post Code</Label>
              <Input
                type="text"
                id="clientAddress-postCode"
                name="clientAddress-postCode"
                defaultValue={info && clientAddress.postCode}
                placeholder="Post Code"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="clientAddress-country">Country</Label>
              <Input
                type="text"
                id="clientAddress-country"
                name="clientAddress-country"
                defaultValue={info && clientAddress.country}
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-5 mb-10">
        <div className="flex gap-10 items-end">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="createdAt">Invoice Date</Label>
            <Input
              type="date"
              id="createdAt"
              defaultValue={info && createdAt}
              name="createdAt"
              placeholder="Invoice Date"
            />
          </div>
          <Select
            name="paymentTerms"
            defaultValue={info && paymentTerms.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Terms</SelectLabel>
                <SelectItem value="1">Net 1 Day</SelectItem>
                <SelectItem value="7">Net 7 Day</SelectItem>
                <SelectItem value="14">Net 14 Day</SelectItem>
                <SelectItem value="30">Net 30 Day</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full max-w-full items-center gap-1.5">
          <Label htmlFor="description">Project Description</Label>
          <Input
            type="text"
            id="description"
            defaultValue={info && description}
            name="description"
            placeholder="Project Description"
          />
        </div>
      </div>

      <ItemList info={info && info.items} />

      {info ? (
        <div className="flex justify-end gap-5 mt-10">
          <Button variant={"outline"}>Cancel</Button>
          <Button id="edit" disabled={loading}>
            {loading ? "Loading..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-5 mt-10">
          <Button type="button" variant={"outline"}>
            Discard
          </Button>
          <Button disabled={loading} id="draft" variant={"secondary"}>
            {loading ? "Loading..." : " Save as Draft"}
          </Button>
          <Button disabled={loading} id="pending">
            {loading ? "Loading..." : " Save & Send"}
          </Button>
        </div>
      )}
    </form>
  );
}
