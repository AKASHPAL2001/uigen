"use client";

import { Loader2, FileCode, FilePlus, FileEdit, Eye, Trash2, FolderInput } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  result?: unknown;
  args?: {
    command?: string;
    path?: string;
    new_path?: string;
  };
}

interface ToolInvocationBadgeProps {
  tool: ToolInvocation;
}

interface ToolDisplay {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getToolDisplay(tool: ToolInvocation): ToolDisplay {
  const { toolName, args } = tool;
  const command = args?.command;
  const path = args?.path;

  // Extract filename from path for display
  const fileName = path ? path.split("/").pop() || path : "";

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return {
          label: fileName ? `Creating ${fileName}` : "Creating file",
          icon: FilePlus,
        };
      case "str_replace":
        return {
          label: fileName ? `Editing ${fileName}` : "Editing file",
          icon: FileEdit,
        };
      case "insert":
        return {
          label: fileName ? `Editing ${fileName}` : "Inserting code",
          icon: FileEdit,
        };
      case "view":
        return {
          label: fileName ? `Reading ${fileName}` : "Reading file",
          icon: Eye,
        };
      default:
        return {
          label: fileName ? `Modifying ${fileName}` : "Modifying file",
          icon: FileCode,
        };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        const newFileName = args?.new_path?.split("/").pop() || "";
        return {
          label: newFileName ? `Moving to ${newFileName}` : "Renaming file",
          icon: FolderInput,
        };
      case "delete":
        return {
          label: fileName ? `Deleting ${fileName}` : "Deleting file",
          icon: Trash2,
        };
      default:
        return {
          label: "Managing files",
          icon: FileCode,
        };
    }
  }

  // Fallback for unknown tools
  return {
    label: toolName.replace(/_/g, " "),
    icon: FileCode,
  };
}

export function ToolInvocationBadge({ tool }: ToolInvocationBadgeProps) {
  const isComplete = tool.state === "result" && tool.result !== undefined;
  const { label, icon: Icon } = getToolDisplay(tool);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <Icon className="w-3.5 h-3.5 text-neutral-500" />
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
