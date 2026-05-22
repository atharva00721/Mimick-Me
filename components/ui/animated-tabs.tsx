'use client';

import React from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { useTabs, type Tab as BaseTab } from '@/hooks/UseTabs';
import { cn } from '@/lib/utils';

export interface Tab extends BaseTab {
  /** Content to render when this tab is active (used when renderContent is not provided) */
  content?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  /** Optional render-prop to render tab content imperatively based on the selected tab */
  renderContent?: (tab: Tab) => React.ReactNode;
}

const transition = {
  type: 'tween' as const,
  ease: 'easeOut' as const,
  duration: 0.15
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
  x: hoveredRect.left - navRect.left - 10,
  y: hoveredRect.top - navRect.top - 4,
  width: hoveredRect.width + 20,
  height: hoveredRect.height + 10
});

const Tabs = ({
  tabs,
  selectedTabIndex,
  setSelectedTab
}: {
  tabs: Tab[];
  selectedTabIndex: number;
  setSelectedTab: (input: [number, number]) => void;
}) => {
  const [buttonRefs, setButtonRefs] = React.useState<Array<HTMLButtonElement | null>>([]);
  const [navRect, setNavRect] = React.useState<DOMRect | null>(null);
  const [selectedRect, setSelectedRect] = React.useState<DOMRect | null>(null);
  const [hoveredRect, setHoveredRect] = React.useState<DOMRect | null>(null);
  const [hoveredTabIndex, setHoveredTabIndex] = React.useState<number | null>(null);

  const navRef = React.useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  React.useEffect(() => {
    setButtonRefs((prev) => {
      const next = prev.slice(0, tabs.length);
      while (next.length < tabs.length) next.push(null);
      return next;
    });
  }, [tabs.length]);

  useIsomorphicLayoutEffect(() => {
    if (navRef.current) {
      setNavRect(navRef.current.getBoundingClientRect());
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    const selectedButton = buttonRefs[selectedTabIndex];
    if (selectedButton) {
      setSelectedRect(selectedButton.getBoundingClientRect());
    }
  }, [selectedTabIndex, buttonRefs]);

  useIsomorphicLayoutEffect(() => {
    const hoveredButton = hoveredTabIndex !== null ? buttonRefs[hoveredTabIndex] : null;
    if (hoveredButton) {
      setHoveredRect(hoveredButton.getBoundingClientRect());
    } else {
      setHoveredRect(null);
    }
  }, [hoveredTabIndex, buttonRefs]);

  return (
    <nav
      ref={navRef}
      className="flex flex-shrink-0 justify-center items-center relative z-0 py-2"
      onPointerLeave={() => setHoveredTabIndex(null)}>
      {tabs.map((item, i) => {
        const isActive = selectedTabIndex === i;

        return (
          <button
            key={item.value}
            className="text-sm relative rounded-md flex items-center h-8 px-4 z-20 bg-transparent cursor-pointer select-none transition-colors"
            onPointerEnter={() => setHoveredTabIndex(i)}
            onFocus={() => setHoveredTabIndex(i)}
            onClick={() => setSelectedTab([i, i > selectedTabIndex ? 1 : -1])}>
            <motion.span
              ref={(el) => {
                setButtonRefs((prev) => {
                  if (prev[i] === el) return prev;
                  const next = [...prev];
                  next[i] = el as HTMLButtonElement;
                  return next;
                });
              }}
              className={cn('block', {
                'text-zinc-500': !isActive,
                'text-black dark:text-white font-semibold': isActive
              })}>
              <small className={item.value === 'danger-zone' ? 'text-red-500' : ''}>{item.label}</small>
            </motion.span>
          </button>
        );
      })}

      <AnimatePresence>
        {hoveredRect && navRect && (
          <motion.div
            key="hover"
            className={`absolute z-10 top-0 left-0 rounded-md ${hoveredTabIndex === tabs.findIndex(({ value }) => value === 'danger-zone')
              ? 'bg-red-100 dark:bg-red-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            initial={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
            animate={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 1 }}
            exit={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
            transition={transition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRect && navRect && (
          <motion.div
            className={`absolute z-10 bottom-0 left-0 h-[2px] ${selectedTabIndex === tabs.findIndex(({ value }) => value === 'danger-zone')
              ? 'bg-red-500'
              : 'bg-black dark:bg-white'
              }`}
            initial={false}
            animate={{
              width: selectedRect.width + 18,
              x: `calc(${selectedRect.left - navRect.left - 9}px)`,
              opacity: 1
            }}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export function AnimatedTabs({ tabs, renderContent }: AnimatedTabsProps) {
  const [hookProps] = React.useState(() => {
    const initialTabId =
      tabs.find((tab) => tab.value === 'home')?.value || tabs[0].value;

    return {
      tabs: tabs.map(({ label, value, subRoutes }) => ({
        label,
        value,
        subRoutes
      })),
      initialTabId
    };
  });

  const framer = useTabs(hookProps);
  const selectedIndex = framer.contentProps.selectedTabIndex;
  const selectedTab = tabs[selectedIndex] ?? tabs[0];

  // Resolve content: render-prop takes priority, then per-tab content field
  const content = renderContent ? renderContent(selectedTab) : selectedTab.content;

  return (
    <div className="w-full">
      <div className="relative flex w-full items-center justify-between border-b dark:border-dark-4 overflow-x-auto overflow-y-hidden">
        <Tabs {...framer.tabProps} tabs={tabs} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transition}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}