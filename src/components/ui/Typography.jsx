export default function Typography({ children, variant='body', className = '', ...props }){
  const map = {
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-600'
  };
  return <div className={`${map[variant] || map.body} ${className}`} {...props}>{children}</div>;
}
