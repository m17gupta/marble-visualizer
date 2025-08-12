"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import StyleAndRenovationPanel from "@/components/workSpace/projectWorkSpace/PreferredImageTab"

const data = [
  { goal: 400 }, { goal: 300 }, { goal: 200 }, { goal: 300 },
  { goal: 200 }, { goal: 278 }, { goal: 189 }, { goal: 239 },
  { goal: 300 }, { goal: 200 }, { goal: 278 }, { goal: 189 },
  { goal: 349 },
]

export default function GalleryImage() {
  const [goal, setGoal] = React.useState(350)
  const onClick = (n: number) => setGoal(v => Math.max(200, Math.min(400, v + n)))

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </SheetTrigger>

        {/* Left sheet with responsive fixed offset */}
        <SheetContent
          side="left"
          className="w-[380px] sm:w-[420px] !left-0 max-w-[100vw] ms-96"

        >
          <div className="mx-auto w-full">
            <SheetHeader>
              <SheetTitle>Inspirations Image</SheetTitle>
              <SheetDescription>Select Image</SheetDescription>
            </SheetHeader>


            <StyleAndRenovationPanel/>
            {/* <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => onClick(-10)} disabled={goal <= 200}>
                  <Minus /><span className="sr-only">Decrease</span>
                </Button>

                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">{goal}</div>
                  <div className="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
                </div>

                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => onClick(10)} disabled={goal >= 400}>
                  <Plus /><span className="sr-only">Increase</span>
                </Button>
              </div>

              <div className="mt-3 h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <Bar dataKey="goal" style={{ fill: "hsl(var(--foreground))", opacity: 0.9 } as React.CSSProperties} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div> */}

            <SheetFooter className="mt-4">
              <Button>Submit</Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Overlay transparent rakho (optional) */}
      <style jsx global>{`
  .fixed.inset-0.bg-black\\/80 { background-color: transparent !important; }

  /* Start from exact left (no gutter) */
  .sheet-offset { left: 0 !important; max-width: 100vw; }
`}</style>
    </>
  )
}
