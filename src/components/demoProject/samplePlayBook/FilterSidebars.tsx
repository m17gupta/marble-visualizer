import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, ChevronLeft } from "lucide-react";

/* -------- visible checkbox -------- */
const Check = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="checkbox"
    className="h-4 w-4 rounded border border-zinc-300 accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    {...props}
  />
);

/* -------- color swatch -------- */
const Swatch = ({ cls }: { cls: string }) => (
  <span className={`inline-block h-6 w-6 rounded-md border ${cls}`} />
);

export function FilterSidebars() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-9 min-w-36 gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>

      {/* Custom portal (no overlay at all) */}
      <SheetPrimitive.Portal>
        {/* Force hide overlay */}
        <style>{`
          [data-radix-dialog-overlay] {
            display: none !important;
            background: transparent !important;
          }
        `}</style>

        <SheetContent
          side="left"
          className="flex w-[360px] flex-col border-r bg-white p-0 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
        >
          {/* Header */}
          <div className="flex items-center gap-2 pe-4 ps-3 pb-0 pt-4">
            <Button
              variant="ghost"
              className="px-2 py-1 bg-transparent border-none hover:border-none"
              onClick={() => setOpen(false)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <SheetHeader className="p-0">
              <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
            </SheetHeader>
          </div>

          <Separator />

          {/* Accordion Sections */}
          <ScrollArea className="h-[calc(100dvh-140px)] px-2 pr-3">
            <Accordion
              type="single"
              defaultValue="category"   // first section open by default
              collapsible               // allow all to be closed; remove if you want always-one-open
              className="[&_[data-state=open]>svg]:rotate-180"
            >
              {/* Category */}
              <AccordionItem value="category">
                <AccordionTrigger className="py-2 text-sm font-medium bg-transparent focus:outline-none focus:ring-0 px-2 hover:border-white hover:no-underline">
                  Category
                </AccordionTrigger>
                <AccordionContent className="ps-3 pe-2">
                  <ul className="space-y-3">
                    {[
                      { name: "EIFS" },
                      { name: "Stone" },
                      { name: "Stain" },
                      { name: "Pediment" },
                      { name: "Wall Panels" },
                      { name: "Brick" },
                    ].map((c) => (
                      <li key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{c.name}</span>
                        </div>
                        <Check />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Color (icons) */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-2 text-sm font-medium bg-transparent focus:outline-none focus:ring-0 px-2 hover:border-white hover:no-underline">
                  Color
                </AccordionTrigger>

                <AccordionContent className="px-2">
                  <ul className="space-y-3">
                    {[
                      {
                        name: "White",
                        icon:
                          "https://www.roomvo.com/static/images/color_family_icons/white.svg",
                      },
                      {
                        name: "Black",
                        icon:
                          "https://www.roomvo.com/static/images/color_family_icons/black.svg",
                      },
                      {
                        name: "Beige",
                        icon:
                          "https://www.roomvo.com/static/images/color_family_icons/beige.svg",
                      },
                      {
                        name: "Gray",
                        icon:
                          "https://www.roomvo.com/static/images/color_family_icons/gray.svg",
                      },
                    ].map((c) => (
                      <li key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.icon}
                            alt={`${c.name} icon`}
                            className="h-6 w-6 shrink-0"
                            loading="lazy"
                          />
                          <span className="text-sm">{c.name}</span>
                        </div>
                        <Check className="h-4 w-4" />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Shade */}
              <AccordionItem value="shade">
                <AccordionTrigger className="py-2 text-sm font-medium bg-transparent focus:outline-none focus:ring-0 px-2 hover:border-white hover:no-underline">
                  Shade
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  {[
                    { name: "Light", cls: "bg-zinc-200" },
                    { name: "Medium", cls: "bg-zinc-400" },
                    { name: "Dark", cls: "bg-zinc-700" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-3">
                        <Swatch cls={s.cls} />
                        <span className="text-sm">{s.name}</span>
                      </div>
                      <Check />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Brand */}
              <AccordionItem value="brand">
                <AccordionTrigger className="py-2 text-sm font-medium bg-transparent focus:outline-none focus:ring-0 px-2 hover:border-white hover:no-underline">
                  Brand
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  <ul className="space-y-3">
                    {[
                      { name: "James Hardie" },
                      { name: "DZINLY" },
                      { name: "Dryvit" },
                    ].map((c) => (
                      <li key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{c.name}</span>
                        </div>
                        <Check />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Style */}
              <AccordionItem value="style">
                <AccordionTrigger className="py-2 text-sm font-medium bg-transparent focus:outline-none focus:ring-0 py-2 px-2 hover:border-white hover:no-underline">
                  Style
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  {["Abstract", "Collage", "Nature"].map((label) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">{label}</span>
                      <Check />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="h-4" />
          </ScrollArea>

          <Separator />

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Button variant="secondary" className="w-1/2 bg-gray-100">
              Clear filters
            </Button>
            <Button className="w-1/2" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </SheetContent>
      </SheetPrimitive.Portal>
    </Sheet>
  );
}
