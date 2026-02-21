import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { ITasksListNotFound } from "@/app/interface/tasks";
import { SearchX } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { createStyles } from "./styles";

export const TasksNotFound: React.FC<ITasksListNotFound> = ({
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
          <SearchX size={40} color={colors.error} />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </View>
  );
};
