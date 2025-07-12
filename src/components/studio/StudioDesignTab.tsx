import { motion } from "framer-motion";
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import {
  // Zap,
  Palette,
  // Layers,
  Eye,
  // Sparkles,
  // AlertCircle,
} from "lucide-react";







export function StudioDesignTab() {
  return (
    <>
      {/* Job Status Alert */}
      {/* {isJobRunning && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            AI is processing your design... This may take a few
            minutes.
          </AlertDescription>
        </Alert>
      )} */}

    

      {/* Style Selection */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Style</Label>
        </div>
        <Select
          value={designSettings.style}
          onValueChange={onStyleChange}
          disabled={isJobRunning || !canEdit}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            {styleOptions.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                <div>
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {style.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div> */}

      <Separator />

      {/* Level Toggle */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">
            Processing Level
          </Label>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Level {designSettings.level}
            </div>
            <div className="text-xs text-muted-foreground">
              {designSettings.level === 1
                ? "Basic processing"
                : "Advanced processing"}
            </div>
          </div>
          <Switch
            checked={designSettings.level === 2}
            onCheckedChange={onLevelChange}
            disabled={isJobRunning || !canEdit}
          />
        </div>
      </motion.div> */}

      <Separator />

      {/* Preserve Objects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">
            Preserve Objects
          </Label>
        </div>
        {/* <div className="space-y-3">
          {preserveOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-3"
            >
              <Checkbox
                id={option.id}
                checked={designSettings.preserve.includes(option.id)}
                onCheckedChange={() => onPreserveToggle(option.id)}
                disabled={isJobRunning || !canEdit}
              />
              <div className="flex-1">
                <Label
                  htmlFor={option.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </motion.div>

      <Separator />

      {/* Color Tone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Color Tone</Label>
        </div>
        {/* <div className="grid grid-cols-2 gap-2">
          {toneOptions.map((tone) => (
            <button
              key={tone.value}
              onClick={() => onToneChange(tone.value)}
              disabled={isJobRunning || !canEdit}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                designSettings.tone === tone.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-muted/30",
                (isJobRunning || !canEdit) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={cn("w-3 h-3 rounded-full", tone.color)}
                />
                <span className="text-sm font-medium">
                  {tone.label}
                </span>
              </div>
            </button>
          ))}
        </div> */}
      </motion.div>

      <Separator />

      {/* Intensity Slider */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Intensity</Label>
          </div>
          <Badge variant="secondary">
            {designSettings.intensity}%
          </Badge>
        </div>
        <Slider
          value={[designSettings.intensity]}
          onValueChange={(value) => onIntensityChange(value[0])}
          max={100}
          step={5}
          className="w-full"
          disabled={isJobRunning || !canEdit}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Subtle</span>
          <span>Dramatic</span>
        </div>
      </motion.div> */}
    </>
  );
}
