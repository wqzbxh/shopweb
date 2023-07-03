import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconChartBar,
  IconLayoutDashboard,
  IconPresentationAnalytics,
  IconSettings,
  IconUsers,
  IconLock,
  IconClockHour7,
  IconClipboardList,
  IconTruck,
  IconUserCircle,
  IconSitemap,
  IconShoppingBag,
} from "@tabler/icons-react";

export const getIconComponent = (iconName: string): React.FC<any> => {
  switch (iconName) {
    case "IconPresentationAnalytics":
      return IconPresentationAnalytics;
    case "IconLayoutDashboard":
      return IconLayoutDashboard;
    case "IconSettings":
      return IconSettings;
    case "IconUsers":
      return IconUsers;
    case "IconSitemap":
      return IconSitemap;
      case "IconShoppingBag":
        return IconShoppingBag;
        case "IconTruck":
          return IconTruck;
    // 添加更多的组件映射
    default:
      return IconPresentationAnalytics;
  }
};
