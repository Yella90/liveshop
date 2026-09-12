export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg">
          <p className="text-sm text-slate-400">Boutiques</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <p className="text-sm text-slate-400">Commandes</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <p className="text-sm text-slate-400">Utilisateurs</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  )
}