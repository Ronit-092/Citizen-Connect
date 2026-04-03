import { BarChart3, TrendingUp } from "lucide-react";

interface AnalyticsChartProps {
  complaints: any[];
}

export default function AnalyticsChart({ complaints }: AnalyticsChartProps) {
  // Calculate monthly stats
  const getMonthlyStats = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push(months[monthIndex]);
    }

    const monthlyCounts = last6Months.map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const count = complaints.filter(c => {
        const complaintMonth = new Date(c.createdAt).getMonth();
        const complaintYear = new Date(c.createdAt).getFullYear();
        const currentYear = new Date().getFullYear();
        return complaintMonth === monthIndex && complaintYear === currentYear;
      }).length;
      return { month, count };
    });

    const maxCount = Math.max(...monthlyCounts.map(m => m.count), 1);
    
    return { monthlyCounts, maxCount };
  };

  const { monthlyCounts, maxCount } = getMonthlyStats();

  // Calculate category distribution
  const getCategoryStats = () => {
    const categories: { [key: string]: number } = {};
    complaints.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });
    
    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    return sortedCategories;
  };

  const categoryStats = getCategoryStats();
  const maxCategoryCount = Math.max(...categoryStats.map(([, count]) => count), 1);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      road: 'bg-blue-500',
      water: 'bg-cyan-500',
      utilities: 'bg-yellow-500',
      health: 'bg-red-500',
      other: 'bg-purple-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Analytics Overview
        </h3>
        <TrendingUp className="w-5 h-5 text-green-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Last 6 Months Activity</h4>
          <div className="flex items-end justify-between gap-2 h-40">
            {monthlyCounts.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-cyan-400 rounded-t-lg transition-all hover:opacity-80 relative group"
                    style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: item.count > 0 ? '20px' : '4px' }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Top Categories</h4>
          <div className="space-y-3">
            {categoryStats.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No data available</p>
            ) : (
              categoryStats.map(([category, count], idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize">{category}</span>
                    <span className="text-gray-400">{count}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(category)} rounded-full transition-all duration-500`}
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
