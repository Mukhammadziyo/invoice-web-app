import React from "react";
import Logo from "../assets/logo.svg";
import ThemesToggle from "./ThemesToggle";
import { useAppStore } from "../lib/zustand";
import Form from "./Form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SideBar() {
  const { sheetOpen, setSheetOpen, editedData } = useAppStore();
  return (
    <>
      <div
        className="bg-[#373B53] 
      flex items-center justify-between rounded-tr-[20px] rounded-br-[20px]
 md:flex-col md:h-full md:fixed md:left-0 md:top-0 md:bottom-0 md:z-[999]"
      >
        <img className="w-full" src={Logo} />
        <div className="mr-5 md:mr-0 md:mb-5 w-full flex flex-col items-center gap-[20px]">
          <ThemesToggle />
          <div className="border-t border-[#494E6E] px-[32px] pt-[24px]">
            <img src="./Oval.svg" alt="" />
          </div>
        </div>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="ml-[110px] min-w-[calc(80%-72px)] min-h-[calc(100%-56px)] overflow-y-scroll"
          side="left"
        >
          <SheetHeader className="sticky top-0 w-full bg-white border-b">
            <SheetTitle>Are you absolutely sure?</SheetTitle>
          </SheetHeader>
          <Form setSheetOpen={setSheetOpen} info={editedData} />
        </SheetContent>
      </Sheet>
    </>
  );
}
