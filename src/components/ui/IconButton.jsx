export default function IconButton({ children, className = '', ...props }){
  return <button className={`p-1 rounded ${className}`} {...props}>{children}</button>;
}
