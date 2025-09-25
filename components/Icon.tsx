import React from 'react';

type IconProps = {
  name: 'gemini' | 'user' | 'send' | 'new-chat' | 'upload' | 'close' | 'copy' | 'menu' | 'idea' | 'code' | 'quill' | 'palette';
  className?: string;
};

// Fix: Use React.ReactElement instead of JSX.Element to resolve "Cannot find namespace 'JSX'" error.
const iconPaths: { [key in IconProps['name']]: React.ReactElement } = {
  gemini: (
    <path
      d="M13.596 3.615a.5.5 0 0 1 .808.59l-5.36 8.183a.5.5 0 0 1-.808-.59l5.36-8.183Zm-3.036-1.12a.5.5 0 0 1 .808.59l-5.36 8.184a.5.5 0 0 1-.808-.59l5.36-8.183Zm-3.036-1.12a.5.5 0 0 1 .808.59L2.972 10.15a.5.5 0 0 1-.808-.59L7.524 1.375Zm-3.036-1.12a.5.5 0 0 1 .808.59L.012 9.03a.5.5 0 0 1-.808-.59L4.488.255A.5.5 0 0 1 4.488.255Z"
      fill="url(#gemini-gradient)"
    />
  ),
  user: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
  send: <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />,
  'new-chat': <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />,
  upload: <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />,
  close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  copy: <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />,
  menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />,
  idea: <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />,
  code: <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />,
  quill: <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />,
  palette: <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
};

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={name === 'gemini' ? "0 0 15 15" : "0 0 24 24"}
    fill="currentColor"
    className={className}
  >
    {name === 'gemini' && (
      <defs>
        <linearGradient id="gemini-gradient" x1="0" y1="0" x2="15" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    )}
    {iconPaths[name]}
  </svg>
);