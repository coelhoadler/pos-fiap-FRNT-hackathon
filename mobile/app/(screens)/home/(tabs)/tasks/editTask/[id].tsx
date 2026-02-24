import EditTask from "@/app/(screens)/tasks/editTask/[id]";
import { ThemedView } from "@/app/components/themed-view";

export default function EditTaskScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <EditTask />
    </ThemedView>
  );
}
