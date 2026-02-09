import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ListItemProject } from "@/app/components/projects/listItemProject";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { ThemedView } from "@/app/components/themed-view";
import { DropdownContent } from "@/app/components/ui/dropdown/dropdownContent";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { useFocusEffect } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { dropdownItemsProjects, legendContentItems } from "./constants";
import { createStyles } from "./styles";

// const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

export default function ProjectsScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [openModalLegend, setOpenModalLegend] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setOpenModalLegend(false);
      setActiveDropdownId(null);
      return () => {};
    }, []),
  );

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
      <Tabs.Screen
        options={{
          headerRight: () => (
            <ActionsButtonsProjects
              pathAdd="/(screens)/home/(tabs)/projects/addProject"
              openModal={() => setOpenModalLegend(true)}
            />
          ),
        }}
      />

      <Text style={styles.title}>Meus Projetos</Text>

      <ScrollView
        style={{ width: "100%", height: "100%" }}
        onScrollBeginDrag={() => setActiveDropdownId(null)}
      >
        {myProjects.map((item) => {
          const isDropDownOpened = activeDropdownId === item.id;
          return (
            <View key={item.id} style={{ zIndex: isDropDownOpened ? 999 : 1 }}>
              <ListItemProject
                id={item.id}
                nameProject={item.name}
                openDropdownActions={isDropDownOpened}
                onPressMoreOptions={() => handleToggleDropdown(item.id)}
                dropdownActions={
                  <DropdownContent
                    onClose={() => {
                      if (isDropDownOpened) {
                        setActiveDropdownId(null);
                      }
                    }}
                    dropdownItems={dropdownItemsProjects}
                  />
                }
                onPressEdit={() => {}}
                onPressDelete={() => {}}
                onPressView={() => {}}
              />
            </View>
          );
        })}
      </ScrollView>

      {openModalLegend && (
        <ModalLegendProjects
          legendContentItems={legendContentItems}
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}
    </ThemedView>
  );
}
