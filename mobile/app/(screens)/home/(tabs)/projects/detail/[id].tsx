import ProjectDetail from "@/app/(screens)/projects/detail/[id]";
import { ThemedView } from "@/app/components/themed-view";

export default function ProjectDetailScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ProjectDetail />
    </ThemedView>
  );
}
