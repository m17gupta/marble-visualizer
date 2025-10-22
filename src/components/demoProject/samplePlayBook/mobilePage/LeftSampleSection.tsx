"use client"
import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { HiOutlineViewGrid } from "react-icons/hi"
import { IoCloseOutline } from "react-icons/io5"
import LeftSection from "../LeftSection"
const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]
export function LeftSampleSection() {
  const [goal, setGoal] = React.useState(350)
  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
       <Button
        className="
          flex items-center justify-center
          !h-12 !w-12
          rounded-full
          bg-white shadow border border-gray-200
          hover:bg-gray-100
          mx-auto -mt-7
          p-0
        "
      >
        <HiOutlineViewGrid className="h-6 w-6 text-gray-700" />
      </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full h-[80vh] max-w-sm">
          {/* <DrawerHeader className="flex justify-between">
            <div className="text-start">
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </div>
              <DrawerClose asChild>
              <Button variant="outline" className="!h-12 !w-12 rounded-full"> <IoCloseOutline className="h-8 w-8 text-gray-700"/> </Button>
            </DrawerClose>
          </DrawerHeader> */}
          <LeftSection/>
          {/* <DrawerFooter>
            <Button>Submit</Button>
          
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
