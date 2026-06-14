export default function PremiumBadgeIcon({
  className = '',
  title,
  style = {},
  size = 24,
  ...props
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={!title}
      {...props}
    >
      {title && <title>{title}</title>}
      
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 12 1 C 14 1 14.5 2 15.5 2.5 C 16.5 3 18 2.5 19 3.5 C 20 4.5 19.5 6 20 7 C 20.5 8 21.5 8.5 21.5 10 C 21.5 11.5 20.5 12 20 13 C 19.5 14 20 15.5 19 16.5 C 18 17.5 16.5 17 15.5 17.5 C 15 17.8 14.5 18.5 14 19 L 16 23 L 12 21 L 8 23 L 10 19 C 9.5 18.5 9 17.8 8.5 17.5 C 7.5 17 6 17.5 5 16.5 C 4 15.5 4.5 14 4 13 C 3.5 12 2.5 11.5 2.5 10 C 2.5 8.5 3.5 8 4 7 C 4.5 6 4 4.5 5 3.5 C 6 2.5 7.5 3 8.5 2.5 C 9.5 2 10 1 12 1 Z M 12 4 L 13.5 7.5 L 17.5 8 L 14.5 10.5 L 15.5 14.5 L 12 12.5 L 8.5 14.5 L 9.5 10.5 L 6.5 8 L 10.5 7.5 Z"
      />
    </svg>
  );
}
