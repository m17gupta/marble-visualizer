import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
const AddSegLists = () => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList className="text-">
          <BreadcrumbItem className="font-semibold text-gray-600">
            Roof
          </BreadcrumbItem>
          <BreadcrumbSeparator />

             <BreadcrumbItem className="font-semibold text-gray-600">
            Roof1
          </BreadcrumbItem>
          <BreadcrumbSeparator />


             <BreadcrumbItem className="font-semibold text-gray-600">
            Roof2
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Roof3</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AddSegLists;
