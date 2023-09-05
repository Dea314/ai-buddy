"use client";

import { useTheme } from "next-themes";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { BotAvatar } from "./bot-avatar";
import { BeatLoader } from "react-spinners";
import { Copy, User } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { Button } from "./ui/button";

export interface ChatMessageProps {
  role: "user" | "system";
  content?: string;
  isLoading?: boolean;
  src?: string;
}

export const ChatMessage = ({
  role,
  content,
  isLoading,
  src,
}: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({
      description: "Copied to clipboard",
    });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm bg-primary/10">
        {isLoading ? <BeatLoader size={5} /> : content}
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && !isLoading && (
        <Button
          className="group-hover:opacity-100 opacity-0 transition"
          onClick={onCopy}
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
