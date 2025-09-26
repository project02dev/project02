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

  // Mobile-first: 2-column grid on small screens for compact layout
  // Avoids vertical "listy" look and prevents overflow by allowing wrapping
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {isCreator ? (
        <>
          <StatCard
            title="Available Balance"
            value={`$${(stats as CreatorStats).balance.toFixed(2)}`}
            icon={<FiDollarSign className="w-6 h-6" />}
            color="text-green-700"
          />
          <StatCard
            title="Total Earnings"
            value={`$${(stats as CreatorStats).totalEarnings.toFixed(2)}`}
            icon={<FiDollarSign className="w-6 h-6" />}
            color="text-green-700"
          />
        </>
      ) : (
        <>
          <StatCard
            title="Saved Projects"
            value={(stats as StudentStats).savedProjects.toString()}
            icon={<FiStar className="w-6 h-6" />}
            color="text-green-700"
          />
          <StatCard
            title="Messages"
            value={(stats as StudentStats).messages.toString()}
            icon={<FiMail className="w-6 h-6" />}
            color="text-green-700"
          />
        </>
      )}
      <StatCard
        title="Active Orders"
        value={stats.activeOrders.toString()}
        icon={<FiPackage className="w-6 h-6" />}
        color="text-green-700"
      />
      <StatCard
        title="Completed Projects"
        value={stats.completedProjects.toString()}
        icon={<FiStar className="w-6 h-6" />}
        color="text-green-700"
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          <p className={`text-lg sm:text-2xl font-semibold ${color} truncate`}>{value}</p>
        </div>
        <div className={`${color} opacity-80 flex-shrink-0`}>{icon}</div>
      </div>
    </div>
  );
}
