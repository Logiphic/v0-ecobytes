export default function DashboardLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#E8EFE8]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#7BAE7F]" />
        <p className="text-sm text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
}
