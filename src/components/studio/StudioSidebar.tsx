import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { StudioTabsNavigation } from './StudioTabsNavigation';
import { DesignSettings, Job } from './types';
import {
  Sparkles,
  Square,
  Lock,
} from "lucide-react";

interface StudioSidebarProps {
  currentUserRole: 'admin' | 'editor' | 'viewer' | null;
  canEdit: boolean;
  canAdmin: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onShareClick: () => void;
  projectId?: string;
  selectedSegmentType: string | null;
  designSettings: DesignSettings;
  isJobRunning: boolean;
  jobError: string | null;
  currentJob: Job | null;
  currentImageUrl: string | null;
  isUploading: boolean;
  jobProgress: number;
  onStyleChange: (value: string) => void;
  onLevelChange: (checked: boolean) => void;
  onPreserveToggle: (id: string) => void;
  onToneChange: (value: string) => void;
  onIntensityChange: (value: number) => void;
  onGenerate: () => void;
  onCancelJob: () => void;
}

export function StudioSidebar({

  canEdit,

  activeTab,
  onTabChange,
  projectId,
  selectedSegmentType,
  designSettings,
  isJobRunning,
  jobError,
  currentJob,
  currentImageUrl,
  isUploading,
  jobProgress,
  onStyleChange,
  onLevelChange,
  onPreserveToggle,
  onToneChange,
  onIntensityChange,
  onGenerate,
  onCancelJob
}: StudioSidebarProps) {
  return (
    <motion.aside
      initial={{ x: -288, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sm:w-72 w-full bg-card border-r border-border flex flex-col h-[calc(100vh-150px)] overflow-y-scroll"
    >
      {/* Sidebar Header */}
      {/* <StudioSidebarHeader
        currentUserRole={currentUserRole}
        canEdit={canEdit}
        canAdmin={canAdmin}
        onShareClick={onShareClick}
      /> */}

      {/* Tabs Navigation */}
      <StudioTabsNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        projectId={projectId}
        selectedSegmentType={selectedSegmentType}
        designSettings={designSettings}
        isJobRunning={isJobRunning}
        canEdit={canEdit}
        jobError={jobError}
        currentJob={currentJob}
        onStyleChange={onStyleChange}
        onLevelChange={onLevelChange}
        onPreserveToggle={onPreserveToggle}
        onToneChange={onToneChange}
        onIntensityChange={onIntensityChange}
      />

      {/* Generate Button - Fixed at bottom */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <AnimatePresence mode="wait">
          {isJobRunning ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span>Generating design...</span>
                <span>{jobProgress}%</span>
              </div>
              <Progress value={jobProgress} className="h-2" />
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelJob}
                className="w-full"
                disabled={!canEdit}
              >
                <Square className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                // onClick={onGenerate}
                disabled={!currentImageUrl || isUploading || !canEdit}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {!canEdit ? (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    View Only
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Design
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
