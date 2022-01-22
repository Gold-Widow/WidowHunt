interface fallbackInput {
  fallbackText?: string
}

const Fallback = ({ fallbackText }: fallbackInput) => {
  const loadingText = fallbackText ?? "Loading..."

  return (
    <div className="spinner-border" role="status">
      <span className="visually-hidden">{loadingText}</span>
    </div>
  )
}

export default Fallback
