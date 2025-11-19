export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8EFE8]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#7BAE7F] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Loading requests...</p>
      </div>
    </div>
  )
}
