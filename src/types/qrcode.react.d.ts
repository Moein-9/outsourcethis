
declare module 'qrcode.react' {
  import * as React from 'react';
  
  interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    bgColor?: string;
    fgColor?: string;
    includeMargin?: boolean;
    style?: React.CSSProperties;
    className?: string;
    renderAs?: 'svg' | 'canvas';
  }
  
  export default function QRCode(props: QRCodeProps): JSX.Element;
}
