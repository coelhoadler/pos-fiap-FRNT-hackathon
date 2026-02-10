import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IProjectListNotFound } from "@/app/interface/projects";
import { CirclePlus, SearchX } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./styles";

export const ProjectsNotFound: React.FC<IProjectListNotFound> = ({
  text,
  onPress,
  style,
  message,
}) => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];
  const styles = createStyles(colorScheme);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.content}>
        <View style={styles.messageWrapper}>
          <SearchX size={50} color={colors.error} />
          <Text style={styles.messageText}>{message}</Text>
        </View>
        <View>
          <Pressable onPress={onPress}>
            <View style={styles.addProjectButton}>
              <CirclePlus size={22} color={colors.text} />
              <Text style={styles.textAddProject}>{text}</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
