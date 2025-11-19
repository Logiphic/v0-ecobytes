export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF5E9]">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#7BAE7F] border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
