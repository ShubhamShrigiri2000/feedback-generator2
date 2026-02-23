export default function Paper({ children, className = '', ...props }){
  return <div className={`bg-gray-50 rounded ${className}`} {...props}>{children}</div>;
}
