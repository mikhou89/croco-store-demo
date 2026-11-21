import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20, rest: SVGProps<SVGSVGElement> = {}) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

export const SearchIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const BagIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>);
export const HeartIcon = ({ size, filled, ...r }: P & { filled?: boolean }) => (<svg {...base(size, r)} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>);
export const MenuIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const CloseIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="m6 6 12 12M18 6 6 18" /></svg>);
export const ChevronRight = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="m9 6 6 6-6 6" /></svg>);
export const ChevronDown = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="m6 9 6 6 6-6" /></svg>);
export const ArrowRight = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowLeft = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>);
export const PlusIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M12 5v14M5 12h14" /></svg>);
export const MinusIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M5 12h14" /></svg>);
export const TrashIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>);
export const EyeIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>);
export const FilterIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>);
export const TruckIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>);
export const ShieldIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
export const BadgeIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><circle cx="12" cy="9" r="6" /><path d="m9 14-2 7 5-3 5 3-2-7" /></svg>);
export const ChatIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 10h8M8 13h5" /></svg>);
export const PhoneIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
export const HomeIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /></svg>);
export const GridIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>);
export const BoxIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></svg>);
export const CheckIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="m5 12 5 5 9-10" /></svg>);
export const InfoIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const BoltIcon = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" /></svg>);
export const WhatsAppIcon = ({ size = 20, ...r }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...r}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z" />
  </svg>
);
export const StarSpark = ({ size, ...r }: P) => (<svg {...base(size, r)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>);
