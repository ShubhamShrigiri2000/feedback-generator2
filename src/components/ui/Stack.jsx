export default function Stack({ children, spacing = 2, direction = 'column', className = '', ...props }){
  const gap = `gap-${spacing}`;
  return <div className={`${direction === 'row' ? 'flex flex-row' : 'flex flex-col'} ${className}`} {...props}>{children}</div>;
}
