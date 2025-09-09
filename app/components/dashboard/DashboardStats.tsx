import { FiDollarSign, FiPackage, FiMail, FiStar } from "react-icons/fi";

interface CreatorStats {
  balance: number;
  totalEarnings: number;
  activeOrders: number;
  completedProjects: number;
}

interface StudentStats {
  activeOrders: number;
  completedProjects: number;
  savedProjects: number;
  messages: number;
}

interface DashboardStatsProps {
  role: "student" | "creator";
  stats: CreatorStats | StudentStats;
}

export default function DashboardStats({ role, stats }: DashboardStatsProps) {
  const isCreator = role === "creator";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {isCreator ? (
        <>
          <StatCard
            title="Available Balance"
            value={`$${(stats as CreatorStats).balance.toFixed(2)}`}
            icon={<FiDollarSign className="w-6 h-6" />}
            color="text-green-600"
          />
          <StatCard
            title="Total Earnings"
            value={`$${(stats as CreatorStats).totalEarnings.toFixed(2)}`}
            icon={<FiDollarSign className="w-6 h-6" />}
            color="text-blue-600"
          />
        </>
      ) : (
        <>
          <StatCard
            title="Saved Projects"
            value={(stats as StudentStats).savedProjects.toString()}
            icon={<FiStar className="w-6 h-6" />}
            color="text-yellow-600"
          />
          <StatCard
            title="Messages"
            value={(stats as StudentStats).messages.toString()}
            icon={<FiMail className="w-6 h-6" />}
            color="text-purple-600"
          />
        </>
      )}
      <StatCard
        title="Active Orders"
        value={stats.activeOrders.toString()}
        icon={<FiPackage className="w-6 h-6" />}
        color="text-indigo-600"
      />
      <StatCard
        title="Completed Projects"
        value={stats.completedProjects.toString()}
        icon={<FiStar className="w-6 h-6" />}
        color="text-green-600"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
        <div className={`${color} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
}
