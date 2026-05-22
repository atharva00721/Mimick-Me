import type { ComponentType } from "react";
import {
  Bot, Globe, Briefcase, Smile, Zap, Minus,
  User, Info, Target, Mail, Calendar, FormInput, Phone, MessageCircle, ExternalLink,
  Sparkles, Layers, Folder, Clock,
} from "lucide-react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  bot: Bot,
  globe: Globe,
  briefcase: Briefcase,
  smile: Smile,
  zap: Zap,
  minus: Minus,
  user: User,
  info: Info,
  target: Target,
  mail: Mail,
  calendar: Calendar,
  form: FormInput,
  phone: Phone,
  message: MessageCircle,
  link: ExternalLink,
  sparkles: Sparkles,
  layers: Layers,
  folder: Folder,
  clock: Clock,
};

export function IconComponent({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export const colorMap: Record<string, string> = {
  blue: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
  green: "border-green-500 bg-green-50 dark:bg-green-950/30",
  purple: "border-purple-500 bg-purple-50 dark:bg-purple-950/30",
  orange: "border-orange-500 bg-orange-50 dark:bg-orange-950/30",
  red: "border-red-500 bg-red-50 dark:bg-red-950/30",
  cyan: "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30",
};

export const iconContainerColorMap: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/50",
  green: "bg-green-100 dark:bg-green-900/50",
  purple: "bg-purple-100 dark:bg-purple-900/50",
  orange: "bg-orange-100 dark:bg-orange-900/50",
  red: "bg-red-100 dark:bg-red-900/50",
  cyan: "bg-cyan-100 dark:bg-cyan-900/50",
};
