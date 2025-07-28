import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FolderOpen } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProjectAccordion } from "./ProjectAccordion";

const ProjectStaticCard = () => {
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    avgProgress:
      projects.length > 0
        ? Math.round(
            projects.reduce((acc, p) => acc + (p?.progress || 0), 0) /
              projects.length
          )
        : 0,
  };
  return (
    <>
      {/* <ProjectAccordion/> */}
      <Accordion type="single" collapsible className="block md:hidden" style={{marginTop: "8px"}}>
        <AccordionItem value="item-1" className="border rounded-lg">
          <AccordionTrigger className="py-2 bg-gray-200 rounded-md">View all</AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
                    <CardTitle className="text-sm font-medium">
                      Total Projects
                    </CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
                    <CardTitle className="text-sm font-medium">
                      Active
                    </CardTitle>
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-2xl font-bold">{stats.active}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently in progress
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
                    <CardTitle className="text-sm font-medium">
                      Completed
                    </CardTitle>
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-2xl font-bold">{stats.completed}</div>
                    <p className="text-xs text-muted-foreground">
                      Successfully finished
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
                    <CardTitle className="text-sm font-medium">
                      Avg. Progress
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-2xl font-bold">
                      {stats.avgProgress}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all projects
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently in progress
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully finished
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgProgress}%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all projects
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div> */}
    </>
  );
};

export default ProjectStaticCard;
