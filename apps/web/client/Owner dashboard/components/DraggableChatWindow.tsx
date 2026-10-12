"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface ChatMessage {
  id: string;
  sender: "contractor" | "owner";
  senderName: string;
  text?: string;
  photoUrl?: string;
  photoCaption?: string;
  isAudio?: boolean;
  audioDuration?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface DraggableChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export function DraggableChatWindow({
  isOpen,
  onClose,
}: DraggableChatWindowProps) {
  const [mounted, setMounted] = useState(false);

  // Position coordinates (fixed relative to viewport)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Window size (adjustable just like desktop Windows apps)
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 385,
    height: 540,
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevSize, setPrevSize] = useState<{ width: number; height: number }>({
    width: 385,
    height: 540,
  });
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resizing state
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStartData, setResizeStartData] = useState<{
    mouseX: number;
    mouseY: number;
    startWidth: number;
    startHeight: number;
    startX: number;
    startY: number;
  }>({
    mouseX: 0,
    mouseY: 0,
    startWidth: 385,
    startHeight: 540,
    startX: 0,
    startY: 0,
  });

  // UI states
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeAttachmentMenu, setActiveAttachmentMenu] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(38);
  const [inputValue, setInputValue] = useState("");
  const [isRepTyping, setIsRepTyping] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial messages pre-populated with realistic field construction dialogue
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "contractor",
      senderName: "Engr. Chidi Okafor",
      text: "Good afternoon Mr. Izu. 4 concrete mixer trucks have arrived on site for the 1st-floor suspended slab pour. Cube slump test is currently being conducted.",
      timestamp: "11:32 AM",
      status: "read",
    },
    {
      id: "msg-2",
      sender: "contractor",
      senderName: "Engr. Chidi Okafor",
      photoUrl:
        "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=700&h=450&fit=crop&q=80",
      photoCaption:
        "Slump test cone reading: 110mm (within allowable ±25mm tolerance). Mix batch ticket #LG-8842.",
      timestamp: "11:34 AM",
      status: "read",
    },
    {
      id: "msg-3",
      sender: "contractor",
      senderName: "Engr. Chidi Okafor",
      isAudio: true,
      audioDuration: "0:28",
      text: "Voice note: Site foreman briefing on vibrator compaction schedule.",
      timestamp: "11:36 AM",
      status: "read",
    },
    {
      id: "msg-4",
      sender: "owner",
      senderName: "You",
      text: "Approved! Engr. Tunde already signed off the MEP electrical conduit sleeves this morning. You can commence pouring immediately.",
      timestamp: "11:40 AM",
      status: "read",
    },
    {
      id: "msg-5",
      sender: "contractor",
      senderName: "Engr. Chidi Okafor",
      text: "Acknowledged, sir! Pouring is underway at Grid 3-C. The site clerk is logging cube test specimens for 7-day and 28-day laboratory curing.",
      timestamp: "11:42 AM",
      status: "read",
    },
  ]);

  // Client-side hydration flag for portal mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default initial position on screen (bottom-right)
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const initialX = Math.max(16, window.innerWidth - size.width - 24);
      const initialY = Math.max(70, window.innerHeight - size.height - 24);
      setPosition({ x: initialX, y: initialY });
      setIsInitialized(true);
    }
  }, [isInitialized, size.width, size.height]);

  // Reset minimized when opened
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  // Keep window in bounds on viewport resize
  useEffect(() => {
    const handleViewportResize = () => {
      if (typeof window === "undefined") return;
      const currentW = isMinimized ? 320 : size.width;
      const currentH = isMinimized ? 46 : size.height;
      setPosition((prev) => ({
        x: Math.min(Math.max(10, prev.x), Math.max(10, window.innerWidth - currentW - 10)),
        y: Math.min(Math.max(10, prev.y), Math.max(10, window.innerHeight - currentH - 10)),
      }));
    };
    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [isMinimized, size.width, size.height]);

  // Auto-scroll chat on new message
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized, isRepTyping]);

  // Voice note simulator
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 4;
        });
      }, 300);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio]);

  // ── Drag Handlers ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const currentW = isMinimized ? 320 : size.width;
      const currentH = isMinimized ? 46 : size.height;

      const minX = 10;
      const maxX = Math.max(10, window.innerWidth - currentW - 10);
      const minY = 10;
      const maxY = Math.max(10, window.innerHeight - currentH - 10);

      setPosition({
        x: Math.min(Math.max(minX, newX), maxX),
        y: Math.min(Math.max(minY, newY), maxY),
      });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isMinimized, size.width, size.height]);

  // Touch drag support
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;

      const currentW = isMinimized ? 320 : size.width;
      const currentH = isMinimized ? 46 : size.height;

      const minX = 10;
      const maxX = Math.max(10, window.innerWidth - currentW - 10);
      const minY = 10;
      const maxY = Math.max(10, window.innerHeight - currentH - 10);

      setPosition({
        x: Math.min(Math.max(minX, newX), maxX),
        y: Math.min(Math.max(minY, newY), maxY),
      });
    };

    const handleTouchEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragOffset, isMinimized, size.width, size.height]);

  const handleStartDrag = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) return;

    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleStartTouchDrag = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) return;

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  // ── Windows App Style Resize Handlers (Edges & Corners) ──
  const handleStartResize = (direction: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setResizeDirection(direction);
    setResizeStartData({
      mouseX: clientX,
      mouseY: clientY,
      startWidth: size.width,
      startHeight: size.height,
      startX: position.x,
      startY: position.y,
    });
  };

  useEffect(() => {
    if (!resizeDirection) return;

    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - resizeStartData.mouseX;
      const deltaY = clientY - resizeStartData.mouseY;

      const minW = 310;
      const maxW = Math.max(340, window.innerWidth - 30);
      const minH = 380;
      const maxH = Math.max(400, window.innerHeight - 30);

      let newWidth = resizeStartData.startWidth;
      let newHeight = resizeStartData.startHeight;
      let newX = resizeStartData.startX;
      let newY = resizeStartData.startY;

      // Adjust width/height & position based on active resize border
      if (resizeDirection.includes("right")) {
        newWidth = Math.min(Math.max(minW, resizeStartData.startWidth + deltaX), maxW);
      }
      if (resizeDirection.includes("bottom")) {
        newHeight = Math.min(Math.max(minH, resizeStartData.startHeight + deltaY), maxH);
      }
      if (resizeDirection.includes("left")) {
        const potentialW = resizeStartData.startWidth - deltaX;
        if (potentialW >= minW && potentialW <= maxW) {
          newWidth = potentialW;
          newX = resizeStartData.startX + deltaX;
        }
      }
      if (resizeDirection.includes("top")) {
        const potentialH = resizeStartData.startHeight - deltaY;
        if (potentialH >= minH && potentialH <= maxH) {
          newHeight = potentialH;
          newY = resizeStartData.startY + deltaY;
        }
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    };

    const handleResizeEnd = () => {
      setResizeDirection(null);
    };

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
    window.addEventListener("touchmove", handleResizeMove);
    window.addEventListener("touchend", handleResizeEnd);

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
      window.removeEventListener("touchmove", handleResizeMove);
      window.removeEventListener("touchend", handleResizeEnd);
    };
  }, [resizeDirection, resizeStartData]);

  // Toggle Maximize / Restore (like native Windows apps)
  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(prevSize);
      setPosition(prevPosition);
      setIsMaximized(false);
    } else {
      setPrevSize(size);
      setPrevPosition(position);
      const targetW = Math.min(540, window.innerWidth - 40);
      const targetH = Math.min(680, window.innerHeight - 80);
      const targetX = Math.max(20, (window.innerWidth - targetW) / 2);
      const targetY = Math.max(40, (window.innerHeight - targetH) / 2);
      setSize({ width: targetW, height: targetH });
      setPosition({ x: targetX, y: targetY });
      setIsMaximized(true);
    }
  };

  // Sending message
  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "owner",
      senderName: "You",
      text: trimmed,
      timestamp: timeStr,
      status: "delivered",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setActiveAttachmentMenu(false);

    // Simulate contractor reply after 1.6s
    setTimeout(() => {
      setIsRepTyping(true);
    }, 800);

    setTimeout(() => {
      setIsRepTyping(false);
      const replyTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const replies = [
        "Received and confirmed, Mr. Izu! I have instructed the site team accordingly.",
        "Understood. We are logging this note into today's site diary and milestone ledger.",
        "Noted! I'll update the site photos and quality telemetry once this pour phase finishes.",
        "Clear sir. Will also provide the laboratory batch crushing report within 48 hours.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const repReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "contractor",
        senderName: "Engr. Chidi Okafor",
        text: randomReply,
        timestamp: replyTime,
        status: "read",
      };
      setMessages((prev) => [...prev, repReply]);
    }, 2400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !mounted) return null;

  // ── Render through Portal directly onto document.body ──
  // This ensures the chat window sits IN FRONT of nav links, sidebar, and all dashboard elements (z-[99999])
  return createPortal(
    <>
      {/* 
        ========================================================================
        CASE A: MINIMIZED COMPACT FORM ('-')
        Clean, beautifully proportioned floating bar with zero overflow or overlap.
        ========================================================================
      */}
      {isMinimized ? (
        <div
          ref={windowRef}
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 99999,
            width: "320px",
            height: "46px",
            userSelect: isDragging ? "none" : "auto",
          }}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartTouchDrag}
          className="flex items-center justify-between px-3 bg-[var(--vt-color-indigo-900,#261A66)] text-white rounded-xl shadow-[0_12px_36px_rgba(38,26,102,0.28)] border border-indigo-950/60 cursor-grab active:cursor-grabbing select-none transition-shadow hover:ring-2 hover:ring-[var(--vt-color-orange-500,#EF5F18)]/40 animate-in fade-in zoom-in-95 duration-150"
          title="Drag to reposition • Click to expand chat"
        >
          {/* Left: Grip Handle, Avatar, Name & Live Status */}
          <div
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            {/* PureRef Grip Hint */}
            <div className="text-white/40 hover:text-white/80 shrink-0 pr-0.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="5" cy="4" r="1.2" />
                <circle cx="11" cy="4" r="1.2" />
                <circle cx="5" cy="8" r="1.2" />
                <circle cx="11" cy="8" r="1.2" />
                <circle cx="5" cy="12" r="1.2" />
                <circle cx="11" cy="12" r="1.2" />
              </svg>
            </div>

            {/* Profile Avatar with hardhat ring */}
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--vt-color-orange-500,#EF5F18)] to-amber-400 p-[1px] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Engr. Chidi Okafor"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--vt-color-indigo-900,#261A66)] rounded-full" />
            </div>

            {/* Contact Name & Live Status */}
            <div className="truncate min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white tracking-tight truncate">
                  Engr. Chidi Okafor
                </span>
                <span title="Verified Lead Site Rep" className="inline-flex items-center shrink-0">
                  <svg className="w-3 h-3 text-[var(--vt-color-orange-400,#F78241)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 5.09L19.45 5.55L20.25 9.87L23.47 12.87L21.36 16.73L22.16 21.05L17.8 21.51L14.71 24.6L12 22.84L9.29 24.6L6.2 21.51L1.84 21.05L2.64 16.73L0.53 12.87L3.75 9.87L4.55 5.55L8.91 5.09L12 2Z" />
                  </svg>
                </span>
              </div>
              <p className="text-[9.5px] text-emerald-300 leading-none truncate flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Online · Active on site</span>
              </p>
            </div>
          </div>

          {/* Right: Expand & Close Action Buttons */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              title="Expand chat window"
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close chat window"
              className="p-1 rounded-md text-white/70 hover:text-rose-300 hover:bg-white/10 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* 
          ========================================================================
          CASE B: FULL WINDOW (ADJUSTABLE SIZE LIKE NORMAL WINDOWS APPS)
          - Free resizing on right/bottom edges & bottom-right corner
          - In front of nav links (z-[99999] portal)
          - No topic or milestone 3 banner
          - WhatsApp styled feed
          ========================================================================
        */
        <div
          ref={windowRef}
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
            zIndex: 99999,
            userSelect: isDragging || resizeDirection ? "none" : "auto",
          }}
          className="flex flex-col rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-[0_20px_60px_rgba(38,26,102,0.22),0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 relative"
        >
          {/* ── Windows Resize Edges & Corners Hitboxes ── */}
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleStartResize("right", e)}
            onTouchStart={(e) => handleStartResize("right", e)}
            className="absolute top-2 bottom-2 right-0 w-2 cursor-ew-resize hover:bg-[var(--vt-color-orange-500,#EF5F18)]/20 transition-colors z-40"
            title="Drag to resize width"
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleStartResize("bottom", e)}
            onTouchStart={(e) => handleStartResize("bottom", e)}
            className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize hover:bg-[var(--vt-color-orange-500,#EF5F18)]/20 transition-colors z-40"
            title="Drag to resize height"
          />
          {/* Left edge */}
          <div
            onMouseDown={(e) => handleStartResize("left", e)}
            onTouchStart={(e) => handleStartResize("left", e)}
            className="absolute top-2 bottom-2 left-0 w-2 cursor-ew-resize hover:bg-[var(--vt-color-orange-500,#EF5F18)]/20 transition-colors z-40"
            title="Drag to resize width"
          />
          {/* Bottom-right corner */}
          <div
            onMouseDown={(e) => handleStartResize("bottom-right", e)}
            onTouchStart={(e) => handleStartResize("bottom-right", e)}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-[var(--vt-color-orange-500,#EF5F18)]/40 transition-colors z-50 rounded-br-2xl"
            title="Drag to resize window"
          />
          {/* Bottom-left corner */}
          <div
            onMouseDown={(e) => handleStartResize("bottom-left", e)}
            onTouchStart={(e) => handleStartResize("bottom-left", e)}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize hover:bg-[var(--vt-color-orange-500,#EF5F18)]/40 transition-colors z-50 rounded-bl-2xl"
            title="Drag to resize window"
          />

          {/* ── WhatsApp Header with PureRef Drag Handle & Windows Controls ── */}
          <div
            onMouseDown={handleStartDrag}
            onTouchStart={handleStartTouchDrag}
            onDoubleClick={toggleMaximize}
            className={`shrink-0 bg-[var(--vt-color-indigo-900,#261A66)] text-white px-3.5 py-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-indigo-950/40 relative select-none ${
              isDragging ? "cursor-grabbing" : ""
            }`}
            title="Drag anywhere to reposition window • Double-click to toggle maximize"
          >
            {/* Left: Avatar & Contact Info */}
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {/* PureRef Drag Grip Hint */}
              <div
                className="text-white/40 hover:text-white/80 transition-colors cursor-grab active:cursor-grabbing pr-0.5"
                title="Drag anywhere"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="5" cy="4" r="1.2" />
                  <circle cx="11" cy="4" r="1.2" />
                  <circle cx="5" cy="8" r="1.2" />
                  <circle cx="11" cy="8" r="1.2" />
                  <circle cx="5" cy="12" r="1.2" />
                  <circle cx="11" cy="12" r="1.2" />
                </svg>
              </div>

              {/* Profile Avatar with Hardhat / Online Dot */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--vt-color-orange-500,#EF5F18)] to-amber-400 p-[1.5px] shadow-sm">
                  <div className="w-full h-full rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
                      alt="Engr. Chidi Okafor"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="text-white text-xs font-bold">CO</span>
                  </div>
                </div>
                {/* Active Dot */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[var(--vt-color-indigo-900,#261A66)] rounded-full shadow-xs"
                  title="Active on site right now"
                />
              </div>

              {/* Contact Name & Status */}
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    Engr. Chidi Okafor
                  </span>
                  {/* Verified Contractor Badge */}
                  <span title="Verified Lead Site Rep" className="inline-flex items-center">
                    <svg
                      className="w-3.5 h-3.5 text-[var(--vt-color-orange-400,#F78241)] shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 5.09L19.45 5.55L20.25 9.87L23.47 12.87L21.36 16.73L22.16 21.05L17.8 21.51L14.71 24.6L12 22.84L9.29 24.6L6.2 21.51L1.84 21.05L2.64 16.73L0.53 12.87L3.75 9.87L4.55 5.55L8.91 5.09L12 2Z" />
                    </svg>
                  </span>
                </div>
                <p className="text-[10px] text-white/70 leading-none truncate mt-0.5">
                  {isRepTyping ? (
                    <span className="text-emerald-300 font-medium animate-pulse">
                      typing...
                    </span>
                  ) : (
                    <span>Lead Site Rep · SolidGround</span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Window Controls (Minimize '-', Maximize/Restore '□', Close '✕') */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Voice call icon (WhatsApp style) */}
              <button
                type="button"
                onClick={() => alert("Initiating secure site VoIP call to Engr. Chidi Okafor...")}
                title="Start site voice call"
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>

              {/* Video call icon (WhatsApp style) */}
              <button
                type="button"
                onClick={() => alert("Connecting live camera feed with Engr. Chidi on site...")}
                title="Live site video inspection"
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </button>

              {/* Windows-style Minimize Button ('-') */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Minimize chat to floating pill (-)"
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Windows-style Maximize / Restore Toggle ('□') */}
              <button
                type="button"
                onClick={toggleMaximize}
                title={isMaximized ? "Restore window size" : "Maximize window"}
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMaximized ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="9" width="14" height="11" rx="1.5" />
                    <path d="M9 5h10v10" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                )}
              </button>

              {/* Close Button ('✕') */}
              <button
                type="button"
                onClick={onClose}
                title="Close chat window"
                className="p-1 rounded-md text-white/70 hover:text-rose-300 hover:bg-white/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Full WhatsApp-Style Chat UI Body ── */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#F4F2FA]/70 relative">
            {/* WhatsApp Doodle Wallpaper Texture Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23261A66' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3Ccircle cx='18' cy='18' r='3'/%3E%3Ccircle cx='48' cy='48' r='3'/%3E%3Cpath d='M20 46h4v4h-4zM46 16h4v4h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* ── Chat Messages Scrollable Feed ── */}
            <div className="relative z-10 flex-1 overflow-y-auto p-3 space-y-2.5 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--vt-color-neutral-300,#CBC8DA)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {/* WhatsApp Date Separator Pill */}
              <div className="flex justify-center my-1">
                <span className="bg-white/85 text-[var(--vt-color-neutral-500,#7C7894)] text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs border border-[var(--vt-color-border-default,#E2E0EC)]">
                  Today
                </span>
              </div>

              {/* Message Bubbles */}
              {messages.map((msg) => {
                const isContractor = msg.sender === "contractor";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isContractor ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-2.5 shadow-2xs text-[11.5px] leading-relaxed transition-all relative ${
                        isContractor
                          ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)]/80 rounded-tl-xs"
                          : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-950,#191147)] border border-[var(--vt-color-orange-200,#FDCAA9)] rounded-tr-xs"
                      }`}
                    >
                      {/* Contractor sender name highlight */}
                      {isContractor && (
                        <div className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] mb-1 flex items-center gap-1">
                          <span>{msg.senderName}</span>
                          <span className="text-[9px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-normal">
                            (Rep)
                          </span>
                        </div>
                      )}

                      {/* Photo Attachment (if present) */}
                      {msg.photoUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs group relative">
                          <img
                            src={msg.photoUrl}
                            alt="Site inspection attachment"
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                            <span className="bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-medium">
                              🔍 Click to inspect test log
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Photo Caption */}
                      {msg.photoCaption && (
                        <p className="text-[10.5px] text-[var(--vt-color-neutral-700,#4F4B66)] mb-1 italic">
                          {msg.photoCaption}
                        </p>
                      )}

                      {/* Audio Voice Note Bubble (WhatsApp style) */}
                      {msg.isAudio && (
                        <div className="flex items-center gap-2.5 my-1 p-2 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                          {/* Play/Pause Button */}
                          <button
                            type="button"
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="w-8 h-8 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0 hover:scale-105 transition-all shadow-xs"
                          >
                            {isPlayingAudio ? (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            )}
                          </button>

                          {/* Audio Waveform Simulator */}
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-center gap-0.5 h-4">
                              {[
                                30, 70, 45, 90, 60, 40, 80, 50, 95, 40, 75, 55, 30, 85, 60, 45,
                                70, 35, 90, 50, 60, 30,
                              ].map((heightPercent, idx) => {
                                const barPercent = (idx / 22) * 100;
                                const isPlayed = barPercent <= audioProgress;

                                return (
                                  <div
                                    key={idx}
                                    style={{ height: `${heightPercent}%` }}
                                    className={`w-1 rounded-full transition-colors ${
                                      isPlayed
                                        ? "bg-[var(--vt-color-orange-500,#EF5F18)]"
                                        : "bg-[var(--vt-color-neutral-300,#CBC8DA)]"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-[var(--vt-color-neutral-500,#7C7894)] font-mono">
                              <span>{isPlayingAudio ? "Playing..." : msg.audioDuration}</span>
                              <span className="text-[8px] uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                                Site Voice Memo
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message Text */}
                      {msg.text && (
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      )}

                      {/* Timestamp & WhatsApp Double Checkmark Status */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[var(--vt-color-neutral-500,#7C7894)] select-none">
                        <span>{msg.timestamp}</span>
                        {!isContractor && (
                          <span
                            className="text-[#34B7F1] font-bold flex items-center"
                            title="Read receipt"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 18 18" fill="none">
                              <path
                                d="M2 9L5.5 12.5L12 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6 9L9.5 12.5L16 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator from contractor */}
              {isRepTyping && (
                <div className="flex items-center gap-2 text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] bg-white px-3 py-1.5 rounded-full border border-[var(--vt-color-border-default,#E2E0EC)] w-fit shadow-2xs">
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Engr. Chidi
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Attachment Menu Popover (Paperclip) ── */}
            {activeAttachmentMenu && (
              <div className="absolute bottom-14 left-3 bg-white rounded-xl shadow-[0_8px_30px_rgba(38,26,102,0.18)] border border-[var(--vt-color-border-default,#E2E0EC)] p-2 z-30 grid grid-cols-2 gap-2 text-[11px] font-medium text-[var(--vt-color-indigo-900,#261A66)] animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachmentMenu(false);
                    setInputValue((prev) => prev + " [Attaching: Milestone 3 BoQ Checklist.pdf] ");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--vt-color-orange-50,#FFF4EE)] transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    📄
                  </span>
                  <div>
                    <p className="font-bold leading-tight">Document</p>
                    <p className="text-[9px] text-[var(--vt-color-neutral-400,#A3A0B8)]">BoQ / Drawings</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachmentMenu(false);
                    setInputValue((prev) => prev + " [Photo: Site Inspection Verification] ");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--vt-color-orange-50,#FFF4EE)] transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    📸
                  </span>
                  <div>
                    <p className="font-bold leading-tight">Site Photo</p>
                    <p className="text-[9px] text-[var(--vt-color-neutral-400,#A3A0B8)]">Take live photo</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachmentMenu(false);
                    setInputValue((prev) => prev + " [Observation: Rebar spacer thickness inquiry] ");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--vt-color-orange-50,#FFF4EE)] transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    ⚠️
                  </span>
                  <div>
                    <p className="font-bold leading-tight">Site Snag</p>
                    <p className="text-[9px] text-[var(--vt-color-neutral-400,#A3A0B8)]">Log observation</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachmentMenu(false);
                    setInputValue((prev) => prev + " [Pinned GPS: Lekki Site Grid 3-C] ");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--vt-color-orange-50,#FFF4EE)] transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    📍
                  </span>
                  <div>
                    <p className="font-bold leading-tight">Location</p>
                    <p className="text-[9px] text-[var(--vt-color-neutral-400,#A3A0B8)]">Site coordinates</p>
                  </div>
                </button>
              </div>
            )}

            {/* ── WhatsApp-Style Input Bar (Bottom) ── */}
            <div className="relative z-10 shrink-0 bg-white border-t border-[var(--vt-color-border-default,#E2E0EC)] p-2.5 flex items-center gap-1.5">
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setInputValue((prev) => prev + "👍 ")}
                title="Add emoji"
                className="p-1.5 rounded-full text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-[var(--vt-color-neutral-100,#ECEAF4)] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>

              {/* Attachment Paperclip Button */}
              <button
                type="button"
                onClick={() => setActiveAttachmentMenu(!activeAttachmentMenu)}
                title="Attach document, site photo or observation"
                className={`p-1.5 rounded-full transition-colors ${
                  activeAttachmentMenu
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                    : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-[var(--vt-color-neutral-100,#ECEAF4)]"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              {/* Message Text Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Engr. Chidi..."
                className="flex-1 bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-1 focus:ring-[var(--vt-color-orange-500,#EF5F18)] rounded-full px-3.5 py-1.5 text-xs text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none transition-all"
              />

              {/* Dynamic Mic / Send Button (WhatsApp Pattern) */}
              {inputValue.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={handleSendMessage}
                  title="Send message (Enter)"
                  className="w-8 h-8 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-[0_2px_8px_rgba(239,95,24,0.35)]"
                >
                  <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(
                      "[Voice Note Recorded: Verified slump test batch #04 and authorized pour.]"
                    );
                  }}
                  title="Record voice note"
                  className="p-1.5 rounded-full text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-[var(--vt-color-neutral-100,#ECEAF4)] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
              )}

              {/* Classic Windows Resize Grip Indicator at bottom-right corner */}
              <div
                onMouseDown={(e) => handleStartResize("bottom-right", e)}
                onTouchStart={(e) => handleStartResize("bottom-right", e)}
                className="ml-0.5 text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-500,#EF5F18)] cursor-nwse-resize p-0.5 transition-colors"
                title="Drag to resize window"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor">
                  <path
                    d="M9 1L1 9M9 5L5 9M9 8L8 9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
