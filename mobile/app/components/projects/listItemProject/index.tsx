import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IListItemProject } from "@/app/interface/projects";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { IconButton } from "../../ui/iconButton";
import { createStyles } from "./styles";

export const ListItemProject: React.FC<IListItemProject> = ({
  nameProject,
  onPressDelete,
  onPressEdit,
  onPressMoreOptions,
  onPressView,
  dropdownActions,
  openDropdownActions,
  summaryMode,
}) => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{nameProject}</Text>
      <View style={styles.actionsWrapper}>
        <View style={styles.actionItem}>
          <IconButton
            onPress={onPressView}
            icon={<Eye size={22} color={colors.colorWhite} />}
          />
        </View>
        {!summaryMode && (
          <>
            <View style={styles.actionItem}>
              <IconButton
                onPress={onPressEdit}
                icon={<Pencil size={20} color={colors.colorWhite} />}
              />
            </View>
            <View style={styles.actionItem}>
              <IconButton
                onPress={onPressDelete}
                icon={<Trash size={20} color={colors.colorWhite} />}
              />
            </View>
          </>
        )}
        <View style={[styles.actionItem, { position: "relative" }]}>
          <IconButton
            onPress={onPressMoreOptions}
            icon={<EllipsisVertical size={22} color={colors.colorWhite} />}
          />

          {openDropdownActions && dropdownActions}
        </View>
      </View>
    </View>
  );
};
