export default function Box({ children, className = '', ...props }){
  return <div className={className} {...props}>{children}</div>;
}
