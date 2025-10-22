import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { QRDialogProps } from "./types";
import { DEFAULT_QR_CODE_URL } from "./constants";

const QRDialog: React.FC<QRDialogProps> = ({
  open,
  onOpenChange,
  qrCodeUrl = DEFAULT_QR_CODE_URL,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* hidden trigger; we open with state */}
        <button className="hidden" />
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-lg border border-zinc-200 bg-white p-0 shadow-xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center justify-between text-[16px]">
            Scan Qr Code
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="mx-auto flex w-full items-center justify-center rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              width={220}
              height={220}
            />
          </div>
          <p className="mt-4 text-center text-sm text-zinc-600">
            Scan the QR code to upload your room pictures
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRDialog;