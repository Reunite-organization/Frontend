export const Icon = ({
  d,
  size = 18,
  stroke = "currentColor",
  strokeWidth = 2,
  fill = "none",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export const SearchIcon = () => (
  <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
);
export const MapPinIcon = () => (
  <Icon d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
);
export const HeartIcon = () => (
  <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
);
export const UserIcon = () => (
  <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
);
export const ArrowLeft = () => <Icon d="M19 12H5 M12 19l-7-7 7-7" />;
export const ShareIcon = () => (
  <Icon d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13" />
);
export const SendIcon = () => <Icon d="M22 2L11 13 M22 2L15 22l-4-9-9-4z" />;
export const EyeIcon = () => (
  <Icon d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
);
export const PlusIcon = () => <Icon d="M12 5v14 M5 12h14" strokeWidth={2.5} />;
