import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ListItemProject } from "@/app/components/projects/listItemProject";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { ThemedView } from "@/app/components/themed-view";
import { DropdownContent } from "@/app/components/ui/dropdown/dropdownContent";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { useFocusEffect } from "@react-navigation/native";
import { router, Tabs } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { dropdownItemsProjects, legendContentItems } from "./constants";
import { createStyles } from "./styles";

import { ProjectsNotFound } from "@/app/components/projects/projectsNotFound";
import { Modal } from "@/app/components/ui/modal";
import { Colors } from "@/app/constants/theme";
import { IProjectService } from "@/app/interface/project";
import { deleteProject, getProjects } from "@/app/services/projects";

export default function Projects() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [openModalLegend, setOpenModalLegend] = useState(false);

  const [projects, setProjects] = useState<IProjectService[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [projectToDelete, setProjectToDelete] =
    useState<IProjectService | null>(null);

  const navigationToNewProject = () => {
    router.navigate("/(screens)/home/(tabs)/projects/addProject");
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
      setOpenModalLegend(false);
      setActiveDropdownId(null);
      setOpenModalDelete(false);
      return () => {};
    }, []),
  );

  const handleToggleDropdown = (id: string) => {
    setActiveDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handlePrepareDelete = (project: IProjectService) => {
    setProjectToDelete(project);
    setOpenModalDelete(true);
  };
  const handleEditProject = (project: IProjectService) => {
    setActiveDropdownId(null);
    router.push({
      pathname: "/(screens)/home/(tabs)/projects/editProject/[id]",
      params: {
        id: project.id!,
        name: project.name,
        description: project.description,
      },
    });
  };
  const handleProjectDetail = (project: IProjectService) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/projects/detail/[id]",
      params: {
        id: project.id!,
        name: project.name,
        description: project.description,
      },
    });
  };

  const handleDelete = async () => {
    if (!projectToDelete?.id) return;

    try {
      setLoading(true);
      await deleteProject(projectToDelete.id);
      setOpenModalDelete(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {loading && projects.length === 0 ? (
        <View style={styles.modalLoading}>
          <Modal
            styleBackdrop={{ backgroundColor: "transparent" }}
            hasCloseButton={false}
            loading={loading}
            contentType="loading"
          />
        </View>
      ) : (
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          onScrollBeginDrag={() => setActiveDropdownId(null)}
        >
          {projects.length === 0 ? (
            <ProjectsNotFound
              text="Crie um novo projeto"
              message="Nenhum projeto encontrado"
              onPress={navigationToNewProject}
            />
          ) : (
            projects.map((item) => {
              const isDropDownOpened = activeDropdownId === item.id;
              return (
                <View
                  key={item.id}
                  style={{ zIndex: isDropDownOpened ? 999 : 1 }}
                >
                  <ListItemProject
                    id={item.id!}
                    nameProject={item.name}
                    openDropdownActions={isDropDownOpened}
                    onPressMoreOptions={() => handleToggleDropdown(item.id!)}
                    dropdownActions={
                      <DropdownContent
                        onClose={() =>
                          isDropDownOpened && setActiveDropdownId(null)
                        }
                        dropdownItems={dropdownItemsProjects}
                      />
                    }
                    onPressEdit={() => handleEditProject(item)}
                    onPressDelete={() => handlePrepareDelete(item)}
                    onPressView={() => handleProjectDetail(item)}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {openModalLegend && (
        <ModalLegendProjects
          legendContentItems={legendContentItems}
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}

      {openModalDelete && (
        <Modal
          contentType={"withActions"}
          hasCloseButton={true}
          loading={loading}
          onClose={() => {
            setOpenModalDelete(false);
            setProjectToDelete(null);
          }}
          text={`Ao excluir o projeto "${projectToDelete?.name}", todas as tarefas serão apagadas. Deseja continuar?`}
          onPressActionB={handleDelete}
          onPressActionA={() => {
            setOpenModalDelete(false);
            setProjectToDelete(null);
          }}
        />
      )}
    </ThemedView>
  );
}
