import { motion } from "framer-motion";
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';

import { StudioTabsNavigation } from "./StudioTabsNavigation";
// import { DesignSettings, Job } from './types';
// import {
//   Sparkles,
//   Square,
//   Lock,
// } from "lucide-react";

interface StudioSidebarProps {
  // currentUserRole: "admin" | "editor" | "viewer" | null;
  // canEdit: boolean;
  // canAdmin: boolean;
   activeTab: string;
  onTabChange: (value: string) => void;
  // onShareClick: () => void;
  projectId?: string;
  // selectedSegmentType: string | null;
  // designSettings: DesignSettings;
  // isJobRunning: boolean;
  // jobError: string | null;
  // currentJob: Job | null;
  // currentImageUrl: string | null;
  // isUploading: boolean;
  // jobProgress: number;
  // onStyleChange: (value: string) => void;
  // onLevelChange: (checked: boolean) => void;
  // onPreserveToggle: (id: string) => void;
  // onToneChange: (value: string) => void;
  // onIntensityChange: (value: number) => void;
  // onGenerate: () => void;
  // onCancelJob: () => void;
}

export function StudioSidebar({
  // canEdit,
  activeTab,
  onTabChange,
  projectId,
}: // selectedSegmentType,
// designSettings,
// isJobRunning,
// jobError,
// // currentJob,

// onStyleChange,
// onLevelChange,
// onPreserveToggle,
// onToneChange,
// onIntensityChange,

StudioSidebarProps) {
  return (
    <motion.aside
      initial={{ x: -288, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sm:w-80 w-full bg-card border-r border-border flex flex-col"
    >
      {/* Tabs Navigation */}
      <StudioTabsNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        projectId={projectId}
        // selectedSegmentType={selectedSegmentType}
        // designSettings={designSettings}
        // isJobRunning={isJobRunning}
        // canEdit={canEdit}
        // jobError={jobError}
        // // currentJob={currentJob}
        // onStyleChange={onStyleChange}
        // onLevelChange={onLevelChange}
        // onPreserveToggle={onPreserveToggle}
        // onToneChange={onToneChange}
        // onIntensityChange={onIntensityChange}
      />
    </motion.aside>
  );
}
