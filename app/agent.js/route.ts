import { NextResponse } from "next/server";
import { validate as validateUuid } from "uuid";

function clampNumber(value: string | null, min: number, max: number, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function sanitizeLabel(value: string | null) {
  const label = (value ?? "").trim().replace(/\s+/g, " ");
  if (!label) return "Chat";
  return label.slice(0, 24);
}

function sanitizePosition(value: string | null): "bottom-right" | "bottom-left" {
  return value === "bottom-left" ? "bottom-left" : "bottom-right";
}

function sanitizeShadow(value: string | null): "none" | "sm" | "md" | "lg" {
  if (value === "none" || value === "sm" || value === "lg") return value;
  return "md";
}

function sanitizeRadius(value: string | null): "full" | "md" | "sm" | "none" {
  if (value === "md" || value === "sm" || value === "none") return value;
  return "full";
}

function sanitizeMobile(value: string | null): "collapse" | "hide" {
  return value === "hide" ? "hide" : "collapse";
}

function sanitizeIcon(value: string | null): "chat-bubble" | "sparkles" | "bot" | "zap" {
  if (value === "sparkles" || value === "bot" || value === "zap") return value;
  return "chat-bubble";
}

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

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const agentId = searchParams.get("agentId")?.trim() ?? "";
  const label = sanitizeLabel(searchParams.get("label"));
  const position = sanitizePosition(searchParams.get("position"));
  const width = clampNumber(searchParams.get("w"), 280, 480, 360);
  const height = clampNumber(searchParams.get("h"), 420, 720, 520);
  const color = searchParams.get("color")?.trim() || "#111827";
  const style = searchParams.get("style")?.trim() || "icon"; // pill or icon
  const greeting = searchParams.get("greeting")?.trim() || "";
  const avatarUrl = searchParams.get("avatar")?.trim() || "";
  const shadow = sanitizeShadow(searchParams.get("shadow"));
  const radius = sanitizeRadius(searchParams.get("radius"));
  const mobile = sanitizeMobile(searchParams.get("mobile"));
  const icon = sanitizeIcon(searchParams.get("icon"));
  const fontUrl = searchParams.get("font")?.trim() || "";
  const name = searchParams.get("name")?.trim() || "Assistant";

  const buttonShadow = SHADOW_MAP[shadow];
  const buttonRadius = style === "pill" ? RADIUS_MAP_PILL[radius] : RADIUS_MAP_ICON[radius];
  const proactive = searchParams.get("proactive")?.trim() || "";
  const proactiveDelay = clampNumber(searchParams.get("proactiveDelay"), 1, 120, 5);

  if (!validateUuid(agentId)) {
    return new NextResponse("console.error('Invalid agentId');", {
      headers: { "content-type": "application/javascript; charset=utf-8" },
      status: 400,
    });
  }

  const script = `(function () {
  var existing = document.getElementById('rep-ai-agent-widget');
  if (existing) return;
  var pos = ${JSON.stringify(position)};
  var styleParam = ${JSON.stringify(style)};
  var avatarUrl = ${JSON.stringify(avatarUrl)};
  var buttonColor = ${JSON.stringify(color)};
  var buttonShadow = ${JSON.stringify(buttonShadow)};
  var buttonRadius = ${JSON.stringify(buttonRadius)};
  var mobileBehavior = ${JSON.stringify(mobile)};
  var launcherIcon = ${JSON.stringify(icon)};
  var fontUrl = ${JSON.stringify(fontUrl)};
  var agentName = ${JSON.stringify(name)};

  /* ---- font loading ---- */
  if (fontUrl) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
    /* extract font family from URL if possible, or assume it's the target */
    try {
      var urlObj = new URL(fontUrl);
      var family = urlObj.searchParams.get('family')?.split(':')[0];
      if (family) {
        var fontStyle = document.createElement('style');
        fontStyle.textContent = '.rep-ai-font { font-family: "' + family + '", sans-serif !important; }';
        document.head.appendChild(fontStyle);
      }
    } catch(e) {}
  }

  /* ---- iframe ---- */
  var iframe = document.createElement('iframe');
  iframe.id = 'rep-ai-agent-widget';
  iframe.src = '${origin}/embed/${agentId}';
  iframe.setAttribute('title', 'AI Chat Assistant');
  iframe.style.cssText = [
    'position:fixed',
    'bottom:90px',
    pos === 'bottom-right' ? 'right:20px' : 'left:20px',
    'width:${width}px',
    'height:${height}px',
    'border:1px solid rgba(0,0,0,0.1)',
    'border-radius:16px',
    'box-shadow:0 24px 64px rgba(0,0,0,0.2)',
    'display:none',
    'z-index:2147483646',
    'opacity:0',
    'transform:translateY(8px) scale(0.97)',
    'transition:opacity 0.22s ease,transform 0.22s ease',
  ].join(';');

  /* mobile styles */
  var mobileStyle = document.createElement('style');
  mobileStyle.textContent = [
    '@media (max-width: 768px) {',
    '  #rep-ai-agent-widget { width: 100% !important; height: 100% !important; bottom: 0 !important; right: 0 !important; left: 0 !important; border-radius: 0 !important; }',
    mobileBehavior === 'hide' ? '  #rep-ai-launcher-wrapper { display: none !important; }' : '',
    mobileBehavior === 'collapse' && styleParam === 'pill' ? '  #rep-ai-launcher { padding: 0 !important; width: 60px !important; border-radius: 9999px !important; }' : '',
    mobileBehavior === 'collapse' && styleParam === 'pill' ? '  #rep-ai-launcher span { display: none !important; }' : '',
    mobileBehavior === 'collapse' && styleParam === 'pill' ? '  #rep-ai-launcher .rep-mobile-icon { display: flex !important; }' : '',
    '}',
  ].join('\\n');
  document.head.appendChild(mobileStyle);

  /* ---- launcher button ---- */
  var button = document.createElement('button');
  button.type = 'button';
  button.id = 'rep-ai-launcher';
  button.setAttribute('aria-label', 'Open chat');

  var chatSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
  var sparklesSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>';
  var botSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
  var zapSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z"/></svg>';
  var closeSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var activeIconSVG = chatSVG;
  if (launcherIcon === 'sparkles') activeIconSVG = sparklesSVG;
  if (launcherIcon === 'bot') activeIconSVG = botSVG;
  if (launcherIcon === 'zap') activeIconSVG = zapSVG;

  if (styleParam === 'icon') {
    button.className = 'rep-ai-font';
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.overflow = 'hidden';
    if (avatarUrl) {
      var img = document.createElement('img');
      img.src = avatarUrl;
      img.alt = '';
      img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:inherit;position:absolute;top:0;left:0;pointer-events:none;';
      button.style.position = 'relative';
      button.appendChild(img);
      /* close icon overlay (hidden initially) */
      var closeOverlay = document.createElement('div');
      closeOverlay.id = 'rep-ai-close-overlay';
      closeOverlay.innerHTML = closeSVG;
      closeOverlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);border-radius:inherit;opacity:0;transition:opacity 0.18s ease;pointer-events:none;';
      button.appendChild(closeOverlay);
    } else {
      button.innerHTML = activeIconSVG;
    }
  } else {
    button.className = 'rep-ai-font';
    button.innerHTML = '<span>' + ${JSON.stringify(label)} + '</span><div class="rep-mobile-icon" style="display:none;">' + activeIconSVG + '</div>';
    button.style.padding = '0 24px';
    button.style.height = '52px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.whiteSpace = 'nowrap';
    button.style.fontWeight = '500';
    button.style.fontSize = '15px';
    button.style.letterSpacing = '0.01em';
  }

  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style[pos === 'bottom-right' ? 'right' : 'left'] = '20px';
  button.style.borderRadius = buttonRadius;
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.background = buttonColor;
  button.style.color = '#ffffff';
  button.style.fontFamily = 'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
  if (fontUrl) {
    button.className = 'rep-ai-font';
  }
  button.style.boxShadow = buttonShadow;
  button.style.zIndex = '2147483647';
  button.style.transition = 'transform 0.2s cubic-bezier(.34,1.56,.64,1),box-shadow 0.2s ease';
  button.onmouseover = function() { button.style.transform = 'scale(1.06)'; };
  button.onmouseout = function() { button.style.transform = 'scale(1)'; };

  var wrapper = document.createElement('div');
  wrapper.id = 'rep-ai-launcher-wrapper';
  wrapper.style.cssText = [
    'position:fixed',
    'bottom:20px',
    pos === 'bottom-right' ? 'right:20px' : 'left:20px',
    'z-index:2147483647',
    'display:inline-flex',
  ].join(';');
  button.style.position = 'relative';
  button.style.bottom = '';
  button.style.right = '';
  button.style.left = '';
  button.style.zIndex = '';
  wrapper.appendChild(button);
  document.body.appendChild(wrapper);

  /* ---- greeting tooltip + proactive badge ---- */
  var greetingParam = ${JSON.stringify(greeting)};
  var proactiveParam = ${JSON.stringify(proactive)};
  var proactiveDelay = ${JSON.stringify(proactiveDelay)};
  var tooltip = null;
  var badge = null;
  var unread = 0;

  if (greetingParam === 'Need help?') {
    greetingParam = 'Chat with ' + agentName;
  }

  function showTooltip(text) {
    if (tooltip) { tooltip.remove(); }
    tooltip = document.createElement('div');
    tooltip.innerText = text;
    tooltip.style.cssText = [
      'position:fixed',
      'bottom:88px',
      pos === 'bottom-right' ? 'right:20px' : 'left:20px',
      'background:#fff',
      'color:#111827',
      'box-shadow:0 4px 20px rgba(0,0,0,0.1)',
      'padding:10px 16px',
      'border-radius:14px',
      pos === 'bottom-right' ? 'border-bottom-right-radius:4px' : 'border-bottom-left-radius:4px',
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',
      fontUrl ? 'font-family:inherit' : '',
      'font-size:14px',
      'font-weight:500',
      'z-index:2147483647',
      'border:1px solid rgba(0,0,0,0.07)',
      'transition:opacity 0.2s ease,transform 0.2s ease',
      'pointer-events:none',
      'max-width:240px',
      'white-space:nowrap',
    ].join(';');
    document.body.appendChild(tooltip);
  }

  function dismissTooltip() {
    if (!tooltip) return;
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(4px)';
    setTimeout(function() { if (tooltip) { tooltip.remove(); tooltip = null; } }, 200);
  }

  function showBadge(count) {
    if (!badge) {
      badge = document.createElement('div');
      badge.style.cssText = [
        'position:absolute',
        'top:-4px',
        pos === 'bottom-right' ? 'right:-4px' : 'left:-4px',
        'min-width:20px',
        'height:20px',
        'background:#ef4444',
        'color:#fff',
        'border-radius:9999px',
        'font-size:11px',
        'font-weight:700',
        'font-family:system-ui,sans-serif',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'padding:0 5px',
        'border:2px solid #fff',
        'box-shadow:0 2px 8px rgba(239,68,68,0.5)',
        'transform:scale(0)',
        'transition:transform 0.3s cubic-bezier(.34,1.56,.64,1)',
        'pointer-events:none',
        'z-index:1',
      ].join(';');
      if (!wrapper.contains(button)) wrapper.appendChild(button);
      wrapper.appendChild(badge);
    }
    badge.innerText = String(count);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { badge.style.transform = 'scale(1)'; });
    });
  }

  function hideBadge() {
    if (!badge) return;
    badge.style.transform = 'scale(0)';
    unread = 0;
  }

  if (greetingParam) showTooltip(greetingParam);

  /* proactive message fires after delay if widget not already opened */
  if (proactiveParam) {
    setTimeout(function() {
      if (open) return;
      unread = 1;
      showBadge(1);
      showTooltip(proactiveParam);
      /* pulse animation on button */
      button.style.animation = 'rep-pulse 1.4s ease infinite';
      if (!document.getElementById('rep-ai-style')) {
        var style = document.createElement('style');
        style.id = 'rep-ai-style';
        style.textContent = '@keyframes rep-pulse{0%,100%{box-shadow:' + ${JSON.stringify(buttonShadow)} + '}50%{box-shadow:' + ${JSON.stringify(buttonShadow)} + ',0 0 0 8px rgba(239,68,68,0.15);}}';
        document.head.appendChild(style);
      }
    }, proactiveDelay * 1000);
  }

  /* ---- open / close logic ---- */
  var open = false;
  button.addEventListener('click', function () {
    open = !open;

    if (open) {
      iframe.style.display = 'block';
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          iframe.style.opacity = '1';
          iframe.style.transform = 'translateY(0) scale(1)';
        });
      });
      /* clear unread state */
      hideBadge();
      dismissTooltip();
      button.style.animation = '';
    } else {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(8px) scale(0.97)';
      setTimeout(function() { iframe.style.display = 'none'; }, 220);
    }

    /* avatar mode: show/hide close overlay */
    if (styleParam === 'icon' && avatarUrl) {
      var overlay = document.getElementById('rep-ai-close-overlay');
      if (overlay) overlay.style.opacity = open ? '1' : '0';
    } else if (styleParam === 'icon') {
      button.innerHTML = open ? closeSVG : activeIconSVG;
    }
  });

  document.body.appendChild(iframe);
})();`;

  return new NextResponse(script, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
