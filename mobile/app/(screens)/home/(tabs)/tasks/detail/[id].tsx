import TaskDetail from "@/app/(screens)/tasks/detail/[id]";
import { ThemedView } from "@/app/components/themed-view";

export default function TaskDetailScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <TaskDetail />
    </ThemedView>
  );
}
