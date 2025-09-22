export interface StyleOptions {
  fontSize: number;
  color: string;
  letterSpacing: number;
  lineHeight: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  shadowColor: string;
  shadowEnabled: boolean;
  textAlign: 'left' | 'center' | 'right';
  textWidth: number;
  positionX: number;
  positionY: number;
  // 3D Effects
  is3DEnabled: boolean;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  skewX: number;
  skewY: number;
  perspective: number;
  depth3D: number;
  gradientEnabled: boolean;
  gradientColor1: string;
  gradientColor2: string;
}

export interface TextBox {
  id: string;
  text: string;
  styles: StyleOptions;
  fontFamily: string;
}

export interface ExportOptions {
  width: number;
  height: number;
  format: 'png' | 'jpeg' | 'svg';
  quality: number; // For jpeg, 0-1
  maintainAspectRatio: boolean;
}
