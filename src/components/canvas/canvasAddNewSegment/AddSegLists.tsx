import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props={
  segType: string;
  groupName: string;
  shortName: string;
}
const AddSegLists = ({ segType, groupName, shortName }: Props) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList className="text-">
          <BreadcrumbItem className="font-semibold text-gray-600">
         {segType}
          </BreadcrumbItem>
          <BreadcrumbSeparator />

             <BreadcrumbItem className="font-semibold text-gray-600">
            {groupName}
          </BreadcrumbItem>
          <BreadcrumbSeparator />


             <BreadcrumbItem className="font-semibold text-gray-600">
            {shortName}
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Roof3</a>
            </BreadcrumbLink>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AddSegLists;
