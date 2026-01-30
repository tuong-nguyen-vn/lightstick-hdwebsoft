interface ColorDisplayProps {
  color: string;
  transitionDuration?: number;
}

export default function ColorDisplay({ 
  color, 
  transitionDuration = 300 
}: ColorDisplayProps) {
  const safeColor = isValidColor(color) ? color : '#000000';

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ 
        backgroundColor: safeColor,
        transition: `background-color ${transitionDuration}ms ease-in-out`
      }}
    />
  );
}

function isValidColor(color: string): boolean {
  if (!color) return false;
  
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
    return true;
  }
  
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    return true;
  }
  
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color)) {
    return true;
  }
  
  const validColorNames = [
    'red', 'green', 'blue', 'white', 'black', 'yellow', 'cyan', 'magenta',
    'orange', 'purple', 'pink', 'gray', 'grey'
  ];
  return validColorNames.includes(color.toLowerCase());
}
