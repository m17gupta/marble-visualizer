import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
    inputKey: string;
    open: boolean;
    value?: string;
    setOpen: (value: boolean) => void;
    deleteData: (data: string) => void;
}
const UserInputPopOver: React.FC<Props> = ({ inputKey, value, open, setOpen, deleteData }) => {

    console.log("UserInputPopOver key:", inputKey);
    console.log("UserInputPopOver value:", value);


    const handleDelete = (data:string ) => {
        
    deleteData(data)
    }
    return (
        <>
            {inputKey === "user-prompt" &&
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}>
                            <Button variant="outline" className="flex align-middle ">
                                {value && value.length > 5 ? `${value.substring(0, 5)}...` : value}
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
                        <div className="flex align-middle">
                           
                            <img src={value} alt="user-input"
                                width={100}
                                height={100}
                            />
                             <span className="ms-2 text-lg text-gray-500"
                             onClick={()=>handleDelete(inputKey)}
                             >&times;</span>
                        </div>


                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[240px] p-3 rounded-xl shadow-lg"
                    sideOffset={8}
                    // onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}>

                    <img
                        src={value}
                        alt="seg-img"


                    />

                </PopoverContent>
            </Popover>}
        </>
    )
}

export default UserInputPopOver