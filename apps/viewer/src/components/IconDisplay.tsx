interface IconDisplayProps {
  icon: string;
  backgroundColor?: string;
}

export default function IconDisplay({ 
  icon, 
  backgroundColor = '#000000' 
}: IconDisplayProps) {
  return (
    <div 
      className="w-screen h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <span 
        className="leading-none animate-pulse"
        style={{ fontSize: '30vmin' }}
      >
        {icon}
      </span>
    </div>
  );
}
