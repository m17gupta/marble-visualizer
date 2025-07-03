import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

const AddInspiration = ({ isOpen, onClose, onSubmit }: Props) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ inspiration: input });
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild></DialogTrigger> */}
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Upload area */}
          <div className="flex flex-col  p-6 border-r">
            <h2 className="text-xl font-medium mb-4">Upload Inspiration Image</h2>
            <div className="w-full h-72 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
  <UploadCloud className="w-6 h-6 text-blue-600" />
</div>

              
             <div className="text-center pt-3">
              <h4 className="text-md font-semibold text-gray-900 pb-2">Drag & drop your image</h4>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>

              {/* <Button className="mt-4" type="button" variant="secondary"></Button> */}
                 <Button type="button" className='mt-4'>Upload Image</Button>
            </div>
            <p className="mt-3 text-xs text-gray-500">Supported formats: JPG, PNG, WEBP</p>
          </div>

          {/* Right: Library */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Library</h2>
              {/* <DialogClose className="text-gray-500 hover:text-gray-700">&times;</DialogClose> */}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
               <div
                    key={i}
                    className="w-full aspect-square rounded-md overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src="https://www.dzinly.org/img/login-img.jpg"
                      alt="Inspiration"
                      className="w-full h-full object-cover"
                    />
                  </div>

              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button">Confirm</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInspiration;
