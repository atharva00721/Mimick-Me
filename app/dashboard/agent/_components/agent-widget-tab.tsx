"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";

const SHADOW_MAP: Record<string, string> = {
  none: "none",
  sm: "0 2px 8px rgba(0,0,0,0.15)",
  md: "0 8px 24px rgba(0,0,0,0.2)",
  lg: "0 16px 48px rgba(0,0,0,0.3)",
};

const RADIUS_MAP_ICON: Record<string, string> = {
  full: "9999px",
  md: "18px",
  sm: "10px",
  none: "0px",
};

const RADIUS_MAP_PILL: Record<string, string> = {
  full: "9999px",
  md: "14px",
  sm: "8px",
  none: "0px",
};

interface AgentWidgetTabProps {
  canGenerateWidget: boolean;
  isWidgetReady: boolean;
  scriptUrl: string;
  scriptSnippet: string;
  iframeSnippet: string;
  appOrigin: string;
  agentId: string | null;
  widgetLabel: string;
  widgetPosition: "bottom-right" | "bottom-left";
  widgetWidth: number;
  widgetHeight: number;
  widgetColor: string;
  widgetStyle: "pill" | "icon";
  widgetGreeting: string;
  widgetShadow: "none" | "sm" | "md" | "lg";
  widgetRadius: "full" | "md" | "sm" | "none";
  widgetAvatarUrl: string;
  widgetProactive: string;
  widgetProactiveDelay: number;
  widgetIcon: "chat-bubble" | "sparkles" | "bot" | "zap";
  widgetMobileBehavior: "collapse" | "hide";
  widgetFontFamily: string;
  setWidgetLabel: (value: string) => void;
  setWidgetPosition: (value: "bottom-right" | "bottom-left") => void;
  setWidgetWidth: (value: number) => void;
  setWidgetHeight: (value: number) => void;
  setWidgetColor: (value: string) => void;
  setWidgetStyle: (value: "pill" | "icon") => void;
  setWidgetGreeting: (value: string) => void;
  setWidgetShadow: (value: "none" | "sm" | "md" | "lg") => void;
  setWidgetRadius: (value: "full" | "md" | "sm" | "none") => void;
  setWidgetProactive: (value: string) => void;
  setWidgetProactiveDelay: (value: number) => void;
  setWidgetIcon: (value: "chat-bubble" | "sparkles" | "bot" | "zap") => void;
  setWidgetMobileBehavior: (value: "collapse" | "hide") => void;
  setWidgetFontFamily: (value: string) => void;
}

function WidgetPreview({ widgetStyle, widgetColor, widgetPosition, widgetGreeting, widgetAvatarUrl, widgetLabel, widgetShadow, widgetRadius, widgetProactive, widgetIcon }: {
  widgetStyle: "pill" | "icon";
  widgetColor: string;
  widgetPosition: "bottom-right" | "bottom-left";
  widgetGreeting: string;
  widgetAvatarUrl: string;
  widgetLabel: string;
  widgetShadow: "none" | "sm" | "md" | "lg";
  widgetRadius: "full" | "md" | "sm" | "none";
  widgetProactive: string;
  widgetIcon: "chat-bubble" | "sparkles" | "bot" | "zap";
}) {
  const shadow = SHADOW_MAP[widgetShadow];
  const radius = widgetStyle === "icon" ? RADIUS_MAP_ICON[widgetRadius] : RADIUS_MAP_PILL[widgetRadius];
  const isRight = widgetPosition === "bottom-right";

  return (
    <div className="lg:col-span-2 hidden lg:flex border rounded-xl bg-muted/30 relative shadow-inner overflow-hidden min-h-[440px] flex-col">
      <div className="text-center py-2.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider border-b bg-muted/10">Live Preview</div>
      <div className="relative flex-1">
        {/* mock website */}
        <div className="absolute inset-4 bg-background border rounded-lg shadow-sm overflow-hidden pointer-events-none opacity-60">
          <div className="h-10 border-b bg-muted/20 flex items-center px-4 gap-3">
            <div className="w-6 h-6 rounded-full bg-muted/60" />
            <div className="h-2 w-20 bg-muted/60 rounded" />
            <div className="flex gap-2 ml-auto">
              <div className="h-2 w-10 bg-muted/50 rounded" />
              <div className="h-2 w-10 bg-muted/50 rounded" />
              <div className="h-2 w-10 bg-muted/50 rounded" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-24 bg-gradient-to-br from-muted/60 to-muted/30 rounded" />
            <div className="h-3 w-2/3 bg-muted/50 rounded" />
            <div className="h-3 w-1/2 bg-muted/40 rounded" />
            <div className="h-3 w-3/4 bg-muted/30 rounded" />
          </div>
        </div>

        {/* floating widget */}
        <div
          className="absolute bottom-6 pointer-events-none flex flex-col gap-2"
          style={{ [isRight ? "right" : "left"]: "24px", alignItems: isRight ? "flex-end" : "flex-start" }}
        >
          {/* greeting tooltip OR proactive bubble */}
          {widgetStyle === "icon" && (widgetGreeting || widgetProactive) && (
            <div
              className="bg-background text-foreground text-xs px-3 py-2 border font-medium shadow-sm max-w-[160px] leading-snug relative"
              style={{
                borderRadius: "10px",
                borderBottomRightRadius: isRight ? "3px" : "10px",
                borderBottomLeftRadius: isRight ? "10px" : "3px",
              }}
            >
              {widgetProactive || widgetGreeting}
            </div>
          )}

          {/* button */}
          <div
            style={{
              backgroundColor: widgetColor,
              color: "#fff",
              boxShadow: shadow,
              borderRadius: radius,
              fontFamily: "system-ui, sans-serif",
              flexShrink: 0,
              ...(widgetStyle === "icon" ? {
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              } : {
                height: "52px",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                fontSize: "15px",
                whiteSpace: "nowrap",
                position: "relative",
              }),
            }}
          >
            {widgetStyle === "icon" ? (
              widgetAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={widgetAvatarUrl} alt="avatar" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: radius, display: "block" }} />
              ) : (
                <div className="flex items-center justify-center">
                  {widgetIcon === "chat-bubble" && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>}
                  {widgetIcon === "sparkles" && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /></svg>}
                  {widgetIcon === "bot" && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>}
                  {widgetIcon === "zap" && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z" /></svg>}
                </div>
              )
            ) : (
              widgetLabel || "Chat"
            )}
            {/* unread badge preview */}
            {widgetProactive && (
              <div style={{
                position: "absolute",
                top: "-4px",
                [isRight ? "right" : "left"]: "-4px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 700,
                minWidth: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
              }}>1</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentWidgetTab(props: AgentWidgetTabProps) {
  const {
    canGenerateWidget,
    isWidgetReady,
    scriptUrl,
    scriptSnippet,
    iframeSnippet,
    appOrigin,
    agentId,
    widgetLabel,
    widgetPosition,
    widgetWidth,
    widgetHeight,
    widgetColor,
    widgetStyle,
    widgetGreeting,
    widgetShadow,
    widgetRadius,
    widgetAvatarUrl,
    widgetProactive,
    widgetProactiveDelay,
    widgetIcon,
    widgetMobileBehavior,
    widgetFontFamily,
    setWidgetLabel,
    setWidgetPosition,
    setWidgetWidth,
    setWidgetHeight,
    setWidgetColor,
    setWidgetStyle,
    setWidgetGreeting,
    setWidgetShadow,
    setWidgetRadius,
    setWidgetProactive,
    setWidgetProactiveDelay,
    setWidgetIcon,
    setWidgetMobileBehavior,
    setWidgetFontFamily,
  } = props;

  return (
    <div className="pt-5">
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg">Get Agent Widget</h3>
          <p className="text-sm text-muted-foreground mt-1">Customize your widget and paste it into any website.</p>
        </div>

        {!canGenerateWidget && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground bg-muted/50">Save your configuration first so your account gets an `agentId` for the widget.</div>}

        {canGenerateWidget && (
          <>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* ── Left: Options ── */}
              <div className="lg:col-span-3 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Style */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Widget Style</Label>
                    <Select value={widgetStyle} onValueChange={(v) => setWidgetStyle(v as "pill" | "icon")}>
                      <SelectTrigger className="w-full shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icon">Minimal Icon</SelectItem>
                        <SelectItem value="pill">Text Button</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Label (pill only) */}
                  {widgetStyle === "pill" && (
                    <div className="space-y-2">
                      <Label htmlFor="widget-label" className="font-semibold">Button Label</Label>
                      <Input id="widget-label" value={widgetLabel} maxLength={24} onChange={(e) => setWidgetLabel(e.target.value)} className="shadow-sm" />
                    </div>
                  )}

                  {/* Greeting tooltip (icon only) */}
                  {widgetStyle === "icon" && (
                    <div className="space-y-2">
                      <Label htmlFor="widget-greeting" className="font-semibold">Greeting Tooltip</Label>
                      <Input id="widget-greeting" value={widgetGreeting} maxLength={40} onChange={(e) => setWidgetGreeting(e.target.value)} className="shadow-sm" placeholder="e.g. Need help?" />
                    </div>
                  )}

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="widget-color" className="font-semibold">Theme Color</Label>
                    <div className="flex gap-2">
                      <Input id="widget-color" type="color" value={widgetColor} onChange={(e) => setWidgetColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer shrink-0" />
                      <Input type="text" value={widgetColor.toUpperCase()} onChange={(e) => setWidgetColor(e.target.value)} className="flex-1 uppercase font-mono shadow-sm" />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Position</Label>
                    <Select value={widgetPosition} onValueChange={(v) => setWidgetPosition(v as "bottom-right" | "bottom-left")}>
                      <SelectTrigger className="w-full shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom right</SelectItem>
                        <SelectItem value="bottom-left">Bottom left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shadow */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Shadow</Label>
                    <Select value={widgetShadow} onValueChange={(v) => setWidgetShadow(v as "none" | "sm" | "md" | "lg")}>
                      <SelectTrigger className="w-full shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Soft</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Corner radius */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Corner Style</Label>
                    <Select value={widgetRadius} onValueChange={(v) => setWidgetRadius(v as "full" | "md" | "sm" | "none")}>
                      <SelectTrigger className="w-full shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Circle / Pill</SelectItem>
                        <SelectItem value="md">Rounded</SelectItem>
                        <SelectItem value="sm">Slightly Rounded</SelectItem>
                        <SelectItem value="none">No Rounding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Widget width */}
                  <div className="space-y-2">
                    <Label htmlFor="widget-width" className="font-semibold">Chat Width <span className="text-muted-foreground font-normal">(px)</span></Label>
                    <Input id="widget-width" type="number" min={280} max={480} value={widgetWidth} onChange={(e) => setWidgetWidth(Math.max(280, Math.min(480, Number(e.target.value) || 360)))} className="shadow-sm" />
                  </div>

                  {/* Widget height */}
                  <div className="space-y-2">
                    <Label htmlFor="widget-height" className="font-semibold">Chat Height <span className="text-muted-foreground font-normal">(px)</span></Label>
                    <Input id="widget-height" type="number" min={420} max={720} value={widgetHeight} onChange={(e) => setWidgetHeight(Math.max(420, Math.min(720, Number(e.target.value) || 520)))} className="shadow-sm" />
                  </div>

                  {/* Mobile Breakpoint */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Mobile Behavior</Label>
                    <Select value={widgetMobileBehavior} onValueChange={(v) => setWidgetMobileBehavior(v as "collapse" | "hide")}>
                      <SelectTrigger className="w-full shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collapse">Collapse to Icon</SelectItem>
                        <SelectItem value="hide">Hide entirely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Launcher Icon */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Launcher Icon</Label>
                    <Select value={widgetIcon} onValueChange={(v) => setWidgetIcon(v as "chat-bubble" | "sparkles" | "bot" | "zap")}>
                      <SelectTrigger className="w-full shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chat-bubble">Chat Bubble</SelectItem>
                        <SelectItem value="sparkles">Sparkles</SelectItem>
                        <SelectItem value="bot">Bot</SelectItem>
                        <SelectItem value="zap">Zap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Font */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="widget-font" className="font-semibold text-sm">Custom Google Font URL <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
                    <Input id="widget-font" value={widgetFontFamily} onChange={(e) => setWidgetFontFamily(e.target.value)} className="shadow-sm" placeholder="e.g. https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
                    <p className="text-xs text-muted-foreground">The font name must match the site typography for the best look.</p>
                  </div>

                  {/* Proactive message */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="widget-proactive" className="font-semibold">Proactive Message <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
                    <Input id="widget-proactive" value={widgetProactive} maxLength={80} onChange={(e) => setWidgetProactive(e.target.value)} className="shadow-sm" placeholder="e.g. 👋 Hey! Got a question? I'm here." />
                    {widgetProactive && (
                      <div className="flex items-center gap-3 mt-2">
                        <Label htmlFor="widget-proactive-delay" className="text-sm shrink-0">Show after</Label>
                        <input id="widget-proactive-delay" type="range" min={1} max={60} step={1} value={widgetProactiveDelay} onChange={(e) => setWidgetProactiveDelay(Number(e.target.value))} className="flex-1 accent-foreground" />
                        <span className="text-sm font-mono w-10 text-right shrink-0">{widgetProactiveDelay}s</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Appears with a 🔴 badge after the delay if the widget is still closed.</p>
                  </div>
                </div>

                {/* Avatar info strip */}
                {widgetAvatarUrl && widgetStyle === "icon" && (
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={widgetAvatarUrl} alt="avatar" className="size-9 rounded-full object-cover shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Your profile photo is the widget button</p>
                      <p className="text-xs text-muted-foreground">Update it in Agent Settings → Avatar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right: Live Preview ── */}
              <WidgetPreview
                widgetStyle={widgetStyle}
                widgetColor={widgetColor}
                widgetPosition={widgetPosition}
                widgetGreeting={widgetGreeting}
                widgetAvatarUrl={widgetAvatarUrl}
                widgetLabel={widgetLabel}
                widgetShadow={widgetShadow}
                widgetRadius={widgetRadius}
                widgetProactive={widgetProactive}
                widgetIcon={widgetIcon}
              />
            </div>

            {/* Code snippets */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="font-semibold">Script Install Snippet</Label>
                <Badge variant="secondary" className="text-xs font-medium">Recommended</Badge>
              </div>
              <CodeBlock code={scriptSnippet} language="html" />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold">Iframe Fallback</Label>
              <CodeBlock code={iframeSnippet} language="html" />
            </div>

            {/* Checklist */}
            <div className="rounded-lg border bg-muted/50 p-4 text-sm space-y-2">
              <p className="font-semibold">Install checklist</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground font-medium">
                <li>Keep your portfolio published and agent enabled.</li>
                <li>Paste the script snippet before the closing <code className="bg-muted px-1 py-0.5 rounded text-foreground">{"</body>"}</code> tag.</li>
                <li>Open your website and click the widget button to test.</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline" size="sm" asChild className="shadow-sm font-medium"><a href={scriptUrl} target="_blank" rel="noreferrer">View Generated Script<ExternalLink className="size-4 ml-2" /></a></Button>
              {agentId && <Button variant="outline" size="sm" asChild className="shadow-sm font-medium"><a href={`${appOrigin}/embed/${agentId}`} target="_blank" rel="noreferrer">Open Embed Preview<ExternalLink className="size-4 ml-2" /></a></Button>}
              <div className="flex items-center"><Badge variant={isWidgetReady ? "default" : "secondary"} className="font-medium">{isWidgetReady ? "Widget ready to install" : "Publish + enable agent to go live"}</Badge></div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
