
import EditProject from "@/app/(screens)/projects/editProject/[id]";
import { ThemedView } from "@/app/components/themed-view";

export default function EditProjectScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <EditProject />
    </ThemedView>
  );
}
