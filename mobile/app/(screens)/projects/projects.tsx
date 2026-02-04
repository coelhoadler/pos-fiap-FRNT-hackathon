import { ListItemProject } from "@/app/components/projects/listItemProject";
import { ThemedView } from "@/app/components/themed-view";
import { DropdownContent } from "@/app/components/ui/dropdown/dropdownContent";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { dropdownItemsProjects } from "./constants";
import { createStyles } from "./styles";

export default function ProjectsScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const handleToggleDropdown = (id: string) => {
    setActiveDropdownId((prevId) => (prevId === id ? null : id));
  };

  const myProjects = [
    { id: "p1", name: "Projeto 1" },
    { id: "p2", name: "Projeto 23" },
    { id: "p3", name: "Projeto 3" },
  ];

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      {activeDropdownId !== null && (
        <Pressable
          style={[styles.dropdownBackDrop]}
          onPress={() => setActiveDropdownId(null)}
        />
      )}

      <Text style={styles.title}>Meus Projetos</Text>

      <ScrollView
        style={{ width: "100%", height: "100%" }}
        onScrollBeginDrag={() => setActiveDropdownId(null)}
      >
        {myProjects.map((item) => (
          <ListItemProject
            key={item.id}
            id={item.id}
            nameProject={item.name}
            onPressEdit={() => {}}
            onPressDelete={() => {}}
            onPressView={() => {}}
            openDropdownActions={activeDropdownId === item.id}
            onPressMoreOptions={() => handleToggleDropdown(item.id)}
            dropdownActions={
              <DropdownContent dropdownItems={dropdownItemsProjects} />
            }
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}
