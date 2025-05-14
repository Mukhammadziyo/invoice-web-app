import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteById, getInvoice, updateById } from "../request";
import { useAppStore } from "../lib/zustand";
import { toast } from "sonner";
import StatusBadje from "../components/StatusBadje";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "../components/ui/button";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateInvoices, setEditedData, setSheetOpen } = useAppStore();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getInvoice(id)
      .then((res) => setInvoice(res))
      .catch(({ message }) => setError(message))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    setDeleteLoading(true);
    deleteById(id)
      .then((res) => {
        updateInvoices(res);
        navigate("/");
      })
      .catch(({ message }) => toast.error(message))
      .finally(() => setDeleteLoading(false));
  }

  function handleUpdate(id, data) {
    setUpdateLoading(true);
    updateById(id, data)
      .then((res) => {
        updateInvoices(res);
        navigate(-1);
      })
      .catch(({ message }) => toast.error(message))
      .finally(() => setUpdateLoading(false));
  }

  function handleEdit(data) {
    setEditedData(data);
    setSheetOpen(true);
  }

  if (loading) return <p className="text-center">Yuklanmoqda...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!invoice) return null;

  const {
    clientName,
    clientEmail,
    clientAddress,
    status,
    invoiceId,
    createdAt,
    paymentDue,
    description,
    senderAddress,
    items,
    total,
  } = invoice;

  return (
    <div className="py-5">
      <div className="base-container flex flex-col gap-6">
        <button
          onClick={() => navigate(-1)}
          className=" flex items-center space-x-4  group  dark:text-white font-thin "
        >
          <p className=" group-hover:opacity-80">Go back</p>
        </button>
        <Card>
          <CardContent className="flex justify-between items-center py-5">
            <div className="flex items-center gap-2">
              <span className=" text-gray-600 dark:text-gray-400">Status:</span>
              <StatusBadje status={status} />
            </div>
            <div className="flex gap-3 flex-wrap justify-end">
              <Button
                className="text-[#7e88c3] text-center dark:bg-[#252945] hover:opacity-80  bg-slate-100 p-3 px-7 rounded-full"
                variant="ghost"
                onClick={() => handleEdit(invoice)}
              >
                Edit
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="ml-3 text-center  text-white bg-red-500 hover:opacity-80 p-3 px-7 rounded-full"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete invoice #{invoiceId}? This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-3 justify-end">
                    <DialogClose className="text-[#7e88c3] text-center dark:bg-[#252945] hover:opacity-80  bg-slate-100 p-3 px-7 rounded-full">
                      Cancel
                    </DialogClose>
                    <Button
                      className="ml-3 text-center  text-white bg-red-500 hover:opacity-80 p-3 px-7 rounded-full"
                      onClick={() => handleDelete(invoice.id)}
                      variant="destructive"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Loading..." : "Delete"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {status === "pending" && (
                <Button
                  className=" ml-3 text-center  text-white bg-[#7c5dfa] hover:opacity-80 p-3 px-7 rounded-full"
                  onClick={() => handleUpdate(invoice.id, { status: "paid" })}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Loading..." : "Mark as Paid"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className=" mt-4 rounded-lg w-full  px-6 py-6 bg-white dark:bg-[#1e2139]">
          <div className=" flex flex-col md:flex-row items-start justify-between w-full ">
            <div>
              <h1 className=" font-semibold dark:text-white text-xl">
                <span className="text-[#7e88c3]">#</span>
                {invoice.id}
              </h1>
              <p className=" text-sm text-gray-500">{invoice.clientName}</p>
            </div>
            <div className=" mt-4 md:mt-0 text-left text-gray-400 text-sm md:text-right felx flex-col items-center">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>

          <div className=" mt-10 grid grid-cols-2 w-full  md:grid-cols-3">
            <div className=" flex flex-col justify-between">
              <div>
                <h3 className="text-gray-400 font-thin">Invoice Date</h3>
                <h1 className="text-lg font-semibold dark:text-white">
                  {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h1>
              </div>
              <div>
                <h3 className="text-gray-400 font-thin">Payment Due</h3>
                <h1 className="dark:text-white text-lg font-semibold">
                  {invoice.paymentDue
                    ? new Date(invoice.paymentDue).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Invalid Date"}
                </h1>
              </div>
            </div>

            <div className="">
              <p className=" text-gray-400 font-thin">Bill to</p>
              <h1 className=" dark:text-white text-lg font-semibold">
                {invoice.clientName}
              </h1>
              <p className=" text-gray-400 font-thin">
                {invoice.clientAddress.street}
              </p>
              <p className=" text-gray-400 font-thin">
                {invoice.clientAddress.city}
              </p>
              <p className=" text-gray-400 font-thin">
                {invoice.clientAddress.postCode}
              </p>
              <p className=" text-gray-400 font-thin">
                {invoice.clientAddress.country}
              </p>
            </div>

            <div className=" mt-8 md:mt-0">
              <p className=" text-gray-400 font-thin">Sent to</p>
              <h1 className=" dark:text-white text-lg font-semibold">
                {invoice.clientEmail}
              </h1>
            </div>
          </div>

          {/* Last Section */}

          <div className=" sm:hidden mt-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg rounded-b-none space-y-4  p-10">
            {invoice.items.map((item) => (
              <div className=" justify-between text-lg dark:text-white flex">
                <h1>{item.name}</h1>
                <h1>£{item.total}</h1>
              </div>
            ))}
          </div>

          <div className=" hidden sm:block mt-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg rounded-b-none space-y-4  p-10">
            {invoice.items.map((item) => (
              <div key={item.name} className=" flex justify-around  ">
                <div className=" space-y-4">
                  <p className=" text-gray-400 font-thin">Item name</p>

                  <h1 className=" dark:text-white text-base font-semibold">
                    {item.name}
                  </h1>
                </div>
                <div className=" space-y-4">
                  <p className=" text-gray-400 font-thin">Qty.</p>

                  <h1 className=" dark:text-white text-base font-semibold">
                    {item.quantity}
                  </h1>
                </div>
                <div className=" space-y-4">
                  <p className=" text-gray-400 font-thin">Item price</p>

                  <h1 className=" dark:text-white text-base font-semibold">
                    £{item.price}
                  </h1>
                </div>
                <div className=" space-y-4">
                  <p className=" text-gray-400 font-thin">Total</p>

                  <h1 className=" dark:text-white text-base font-semibold">
                    £{item.total}
                  </h1>
                </div>
              </div>
            ))}
          </div>
          <div className=" p-10 font-semibold text-white rounded-lg rounded-t-none justify-between flex dark:bg-black bg-gray-700 ">
            <h3 className=" text-xl ">Amount Due</h3>

            <h1 className=" text-3xl">£{invoice.total}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
