import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { CONVERSATION_STRATEGY_MODES, type ConversationStrategyMode } from "@/lib/agent/strategy-modes";
import { ResumeUpload } from "../resume-upload";
import { BEHAVIOR_PRESETS, DAY_LABELS, MODELS, STRATEGY_MODES } from "./agent-config";
import type { AgentConfigState } from "./types";

interface AgentSettingsTabProps {
  config: AgentConfigState;
  isPending: boolean;
  agentId: string | null;
  onSave: () => void;
  setConfig: (config: Partial<AgentConfigState>) => void;
}

export function AgentSettingsTab({ config, isPending, agentId, onSave, setConfig }: AgentSettingsTabProps) {
  return (
    <div className="space-y-6 pt-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Enable AI Assistant</CardTitle>
            <CardDescription>Responds to visitor questions and captures leads.</CardDescription>
          </div>
          <Switch checked={config.isEnabled} onCheckedChange={(checked) => setConfig({ isEnabled: checked })} disabled={isPending} />
        </CardHeader>

        <CardContent className={`${config.isEnabled ? "" : "opacity-60 pointer-events-none"} transition-opacity duration-200`}>
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-8 gap-y-8">
            <div className="space-y-1"><Label className="text-sm font-semibold">AI Model</Label><p className="text-xs text-muted-foreground">Select the underlying model power.</p></div>
            <div>
              <Select value={config.model} onValueChange={(value) => setConfig({ model: value })} disabled={isPending}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a model" /></SelectTrigger>
                <SelectContent>
                  {MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full pr-4 gap-4">
                        <span className="font-medium">{model.label}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1"><Label className="text-sm font-semibold">Behavior Preset</Label><p className="text-xs text-muted-foreground">How the assistant communicates.</p></div>
            <div>
              <Select value={config.behaviorType} onValueChange={(value) => setConfig({ behaviorType: value })} disabled={isPending}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a preset" /></SelectTrigger>
                <SelectContent>
                  {BEHAVIOR_PRESETS.map((preset) => <SelectItem key={preset.value} value={preset.value} className="font-medium">{preset.label}</SelectItem>)}
                  <SelectItem value="custom" className="font-medium">Custom Instructions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1"><Label className="text-sm font-semibold">Conversation Strategy</Label><p className="text-xs text-muted-foreground">The goal of the interactions.</p></div>
            <div className="space-y-2">
              <Select value={config.strategyMode} onValueChange={(value) => setConfig({ strategyMode: value as ConversationStrategyMode })} disabled={isPending}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a strategy" /></SelectTrigger>
                <SelectContent>{STRATEGY_MODES.map((mode) => <SelectItem key={mode.value} value={mode.value} className="font-medium">{mode.label}</SelectItem>)}</SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground font-medium">{CONVERSATION_STRATEGY_MODES[config.strategyMode].description}</p>
            </div>

            <div className="space-y-1"><Label className="text-sm font-semibold">Agent Name</Label><p className="text-xs text-muted-foreground">Shown in chat headers and intro copy.</p></div>
            <Input value={config.displayName} onChange={(e) => setConfig({ displayName: e.target.value })} placeholder="e.g. Alex from Acme" maxLength={80} disabled={isPending} />
            <div className="space-y-1"><Label className="text-sm font-semibold">Role Label</Label><p className="text-xs text-muted-foreground">Optional short descriptor like Sales Advisor.</p></div>
            <Input value={config.roleLabel} onChange={(e) => setConfig({ roleLabel: e.target.value })} placeholder="e.g. Solutions Consultant" maxLength={60} disabled={isPending} />
            <div className="space-y-1"><Label className="text-sm font-semibold">Avatar URL</Label><p className="text-xs text-muted-foreground">Optional image URL for embed/public chat identity.</p></div>
            <Input value={config.avatarUrl} onChange={(e) => setConfig({ avatarUrl: e.target.value })} placeholder="https://..." disabled={isPending} />
            <div className="space-y-1"><Label className="text-sm font-semibold">Intro Message</Label><p className="text-xs text-muted-foreground">Short intro shown when the chat starts.</p></div>
            <Textarea value={config.intro} onChange={(e) => setConfig({ intro: e.target.value })} placeholder="Hi! I'm here to help you evaluate if we're a fit." maxLength={280} className="min-h-[90px]" disabled={isPending} />
            <div className="space-y-1"><Label className="text-sm font-semibold">Lead Notification Email</Label><p className="text-xs text-muted-foreground">Override the default account email for leads captured by this agent.</p></div>
            <Input type="email" value={config.notificationEmail || ""} onChange={(e) => setConfig({ notificationEmail: e.target.value })} placeholder="leads@myportfolio.com" disabled={isPending} />

            {config.behaviorType === "custom" && (
              <>
                <div className="space-y-1"><Label className="text-sm font-semibold">Custom System Prompt</Label><p className="text-xs text-muted-foreground">Define specific boundaries.</p></div>
                <Textarea placeholder="Define tone, boundaries, and response style for your agent." className="min-h-[120px] resize-y" value={config.customPrompt} onChange={(e) => setConfig({ customPrompt: e.target.value })} disabled={isPending} />
              </>
            )}

            <div className="space-y-1"><Label className="text-sm font-semibold">Creativity</Label><p className="text-xs text-muted-foreground">Adjust the model&apos;s randomness.</p></div>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center"><span className="text-xs font-medium text-muted-foreground">Focused</span><span className="text-sm font-mono text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">{config.temperature.toFixed(1)}</span><span className="text-xs font-medium text-muted-foreground">Creative</span></div>
              <Slider value={[config.temperature]} onValueChange={([value]) => setConfig({ temperature: value })} min={0.2} max={0.8} step={0.1} disabled={isPending} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 border-t border-border justify-end">
          <Button onClick={onSave} disabled={isPending}>{isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}{isPending ? "Saving..." : "Save Configuration"}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Availability & Business Hours</CardTitle><CardDescription>Configure when the agent can schedule meetings and specific off-days.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-8 gap-y-8">
            <div className="space-y-1"><Label className="text-sm font-semibold">Weekly Availability</Label><p className="text-xs text-muted-foreground">Enable days and set time windows.</p></div>
            <div className="space-y-2">
              {config.workingHours.map((wh, idx) => (
                <div key={wh.dayOfWeek} className="flex flex-wrap items-center gap-3 rounded border border-border p-2.5">
                  <div className="w-28 text-sm font-medium">{DAY_LABELS[wh.dayOfWeek]}</div>
                  <Switch checked={wh.enabled} onCheckedChange={(enabled) => { const newHours = [...config.workingHours]; newHours[idx] = { ...wh, enabled }; setConfig({ workingHours: newHours }); }} disabled={isPending} />
                  <div className="flex items-center gap-2">
                    <Input type="time" value={wh.startTime} onChange={(e) => { const newHours = [...config.workingHours]; newHours[idx] = { ...wh, startTime: e.target.value }; setConfig({ workingHours: newHours }); }} disabled={isPending || !wh.enabled} className="w-32" />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input type="time" value={wh.endTime} onChange={(e) => { const newHours = [...config.workingHours]; newHours[idx] = { ...wh, endTime: e.target.value }; setConfig({ workingHours: newHours }); }} disabled={isPending || !wh.enabled} className="w-32" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1"><Label className="text-sm font-semibold">Specific Off Days</Label><p className="text-xs text-muted-foreground">Comma separated dates to block off (e.g. 2026-12-25, 2026-11-28).</p></div>
            <Textarea placeholder="e.g. 2026-12-25, 2026-11-28" className="min-h-[80px]" value={config.offDays.join(", ")} onChange={(e) => setConfig({ offDays: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} disabled={isPending} />
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t border-border justify-end">
          <Button onClick={onSave} disabled={isPending}>{isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}{isPending ? "Saving..." : "Save Configuration"}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Resume</CardTitle><CardDescription>Upload a resume PDF to add to your agent&apos;s knowledge base.</CardDescription></CardHeader>
        <CardContent className="space-y-4"><ResumeUpload agentId={agentId} /><p className="text-xs text-muted-foreground">Added resumes appear in the Knowledge Base tab.</p></CardContent>
      </Card>
    </div>
  );
}
