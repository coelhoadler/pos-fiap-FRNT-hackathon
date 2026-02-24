import ColumnTaskDetail from "@/app/(screens)/tasks/column/[id]";
import { ThemedView } from "@/app/components/themed-view";

export default function ColumnTaskDetailScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ColumnTaskDetail />
    </ThemedView>
  );
}
