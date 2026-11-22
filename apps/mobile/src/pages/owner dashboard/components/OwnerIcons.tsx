import React from 'react';
import Svg, { Path, Rect, Line, Polyline, Circle, Polygon } from 'react-native-svg';
import { OwnerNavId } from '../data/ownerDashboardData';

interface IconProps {
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function OwnerNavIcon({
  id,
  color,
  size = 20,
  strokeWidth = 2,
}: { id: OwnerNavId } & IconProps) {
  switch (id) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Polyline
            points="9 22 9 12 15 12 15 22"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'projects':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            width="20"
            height="14"
            x="2"
            y="7"
            rx="2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'transactions':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            width="20"
            height="14"
            x="2"
            y="5"
            rx="2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line
            x1="2"
            y1="10"
            x2="22"
            y2="10"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'representatives':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="9"
            cy="7"
            r="4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M22 21v-2a4 4 0 0 0-3-3.87"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'find-companies':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="11"
            cy="11"
            r="8"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'inspectors':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Rect
            x="8"
            y="2"
            width="8"
            height="4"
            rx="1"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="m9 14 2 2 4-4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'notifications':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="12"
            cy="12"
            r="3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
}

export function MenuHamburgerIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

export function SunIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2.2" />
      <Path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MoonIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ color, size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ color, size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="15 18 9 12 15 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LogoutIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function QuickActionIllustration({
  id,
  indigoColor,
  surfaceColor,
}: {
  id: string;
  indigoColor: string;
  surfaceColor: string;
}) {
  switch (id) {
    case 'share-link':
      return (
        <Svg width={56} height={46} viewBox="0 0 64 56" fill="none">
          <Rect x="8" y="16" width="36" height="26" rx="4" stroke={indigoColor} strokeWidth="2" fill={surfaceColor} />
          <Path d="M8 22H44" stroke={indigoColor} strokeWidth="1.8" />
          <Rect x="26" y="24" width="28" height="22" rx="4" stroke="#EF5F18" strokeWidth="2" fill="#FFF4EE" />
          <Path d="M35 35L45 35" stroke="#D84C0B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M40 30L45 35L40 40" stroke="#D84C0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'message-contractor':
      return (
        <Svg width={56} height={46} viewBox="0 0 64 56" fill="none">
          <Rect x="10" y="12" width="34" height="24" rx="6" stroke={indigoColor} strokeWidth="2" fill={surfaceColor} />
          <Line x1="18" y1="20" x2="36" y2="20" stroke={indigoColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1="18" y1="26" x2="28" y2="26" stroke={indigoColor} strokeWidth="2" strokeLinecap="round" />
          <Rect x="28" y="22" width="28" height="20" rx="5" stroke="#EF5F18" strokeWidth="2" fill="#FFF4EE" />
          <Circle cx="36" cy="32" r="1.8" fill="#EF5F18" />
          <Circle cx="42" cy="32" r="1.8" fill="#EF5F18" />
          <Circle cx="48" cy="32" r="1.8" fill="#EF5F18" />
        </Svg>
      );
    case 'assign-rep':
      return (
        <Svg width={56} height={46} viewBox="0 0 64 56" fill="none">
          <Rect x="16" y="14" width="32" height="34" rx="4" stroke={indigoColor} strokeWidth="2" fill={surfaceColor} />
          <Rect x="26" y="10" width="12" height="4" rx="1.5" fill="#EF5F18" />
          <Circle cx="32" cy="26" r="5.5" stroke={indigoColor} strokeWidth="1.8" />
          <Path d="M22 40C22 36 26 34 32 34C38 34 42 36 42 40" stroke={indigoColor} strokeWidth="1.8" strokeLinecap="round" />
          <Circle cx="42" cy="37" r="6" fill="#EF5F18" />
          <Path d="M39.5 37L41.5 39L44.5 35" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'site-weather':
      return (
        <Svg width={56} height={46} viewBox="0 0 64 56" fill="none">
          <Circle cx="25" cy="23" r="10" stroke="#EF5F18" strokeWidth="2.2" fill="#FFF4EE" />
          <Path
            d="M26 37C26 32.58 29.58 29 34 29C34.7 29 35.37 29.09 36.01 29.26C37.38 26.16 40.51 24 44.17 24C49.14 24 53.17 28.03 53.17 33C53.17 33.33 53.15 33.66 53.12 33.98C54.84 34.8 56 36.56 56 38.6C56 41.58 53.58 44 50.6 44H32C28.69 44 26 41.31 26 38"
            fill={surfaceColor}
            stroke={indigoColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </Svg>
      );
    default:
      return (
        <Svg width={56} height={46} viewBox="0 0 64 56" fill="none">
          <Polygon points="32,7 52,18 52,38 32,49 12,38 12,18" stroke="#E11D48" strokeWidth="2" fill="#FFF1F2" />
          <Rect x="26" y="21" width="4" height="14" rx="2" fill="#E11D48" />
          <Rect x="34" y="21" width="4" height="14" rx="2" fill="#E11D48" />
        </Svg>
      );
  }
}

export function DocumentCheckIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="9 15 11 17 15 13" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DocumentListIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
    </Svg>
  );
}

export function EscrowShieldIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m9 12 2 2 4-4" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CameraLogIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2.1" />
    </Svg>
  );
}

export function PlusIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}
