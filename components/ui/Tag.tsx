type TagProps = {
  children: React.ReactNode
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-primary text-primary bg-primary/10">
      {children}
    </span>
  )
}
