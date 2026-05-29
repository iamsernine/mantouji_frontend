import { getMyCoopNotifications } from "@/lib/api";

type ApiNotification = {
  read?: boolean;
};

export async function fetchCoopUnreadNotificationsCount(): Promise<number> {
  try {
    const res = await getMyCoopNotifications();
    const items = (res.data ?? []) as ApiNotification[];
    return items.filter((n) => !n.read).length;
  } catch {
    return 0;
  }
}
