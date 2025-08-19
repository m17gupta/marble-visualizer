import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
    inputKey: string;
    name?: string;
    open: boolean;
    value?: string;
    setOpen: (value: boolean) => void;
    deleteData: (data: string) => void;
}
const UserInputPopOver: React.FC<Props> = ({ inputKey,name, value, open, setOpen, deleteData }) => {

    console.log("UserInputPopOver", inputKey, value, open);
    const handleDelete = (data:string ) => {
        deleteData(data);
    }
    return (
        <>
            {inputKey === "user-prompt" &&
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}>
                            <Button variant="outline" className="flex align-middle w-40">
                                {value && value.length > 5 ? `${value.substring(0, 15)}...` : value}
                                <span className="ms-2 text-lg text-gray-500"
                                    onClick={() => handleDelete(inputKey)}
                                >&times;</span>
                            </Button>

                        </div>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-[240px] p-3 rounded-xl shadow-lg"
                        sideOffset={8}
                        // onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}>

                        <h5 className="text-sm font-semibold mb-2">
                            {value}
                        </h5>

                    </PopoverContent>
                </Popover>}

            {inputKey == "inspiration-image" && <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}>
                        <div className="inline-flex items-center bg-white border border-gray-300 rounded-xl px-2 py-1 gap-2 shadow-sm transition-transform duration-200 hover:scale-105 border-red-400">
                            <img src={value} alt="user-input"
                                className='w-6 h-6 rounded-md object-cover'
                            />
                             <p className='text-sm'>{name} </p>
                               <span className="text-sm text-gray-500  hover:text-gray-700 cursor-pointer"
                                onClick={()=>handleDelete(inputKey)}
                                >&times;
                             </span>
                        </div>


                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[240px] p-3 rounded-xl shadow-lg"
                    sideOffset={8}
                    // onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}>
              <h6 className='text-md font-semibold mb-2'>{name} </h6>
                    <img
                        src={value}
                        alt="seg-img"
                        className='rounded-md'
                    />

                </PopoverContent>
            </Popover>}


            {inputKey == "palette-image" && <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}>
                        <div className="inline-flex items-center bg-white border border-gray-300 rounded-xl px-2 py-1 gap-2 shadow-sm transition-transform duration-200 hover:scale-105 border-red-400">
                            <img src={value} alt="user-input"
                                className='w-6 h-6 rounded-md object-cover'
                            />
                             <p className='text-sm'>{name} </p>
                               <span className="text-sm text-gray-500  hover:text-gray-700 cursor-pointer"
                                onClick={()=>handleDelete(inputKey)}
                                >&times;
                             </span>
                        </div>


                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[240px] p-3 rounded-xl shadow-lg"
                    sideOffset={8}
                    // onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}>
              <h6 className='text-md font-semibold mb-2'>{name} </h6>
                    <img
                        src={value}
                        alt="seg-img"
                        className='rounded-md'
                    />

                </PopoverContent>
            </Popover>}
        </>
    )
}

export default UserInputPopOver