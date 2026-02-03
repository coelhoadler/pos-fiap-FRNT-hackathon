import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IListItemProject } from "@/app/interface/projects";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { IconButton } from "../../ui/iconButton";
import { createStyles } from "./styles";

export const ListItemProject: React.FC<IListItemProject> = ({
  nameProject,
  onPressDelete,
  onPressEdit,
  onPressMoreOptions,
  onPressView,
}) => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];

  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

  return (
    <View style={createStyles(colorScheme).wrapper}>
      <Text style={createStyles(colorScheme).title}>{nameProject}</Text>
      <View style={createStyles(colorScheme).actionsWrapper}>
        <View style={createStyles(colorScheme).actionItem}>
          <IconButton
            onPress={onPressView}
            icon={<Eye size={22} color={colors.colorWhite} />}
          />
        </View>
        <View style={createStyles(colorScheme).actionItem}>
          <IconButton
            onPress={onPressEdit}
            icon={<Pencil size={20} color={colors.colorWhite} />}
          />
        </View>
        <View style={createStyles(colorScheme).actionItem}>
          <IconButton
            onPress={onPressDelete}
            icon={<Trash size={20} color={colors.colorWhite} />}
          />
        </View>
        <View
          style={[
            createStyles(colorScheme).actionItem,
            { position: "relative" },
          ]}
        >
          <IconButton
            onPress={() => {
              setMoreOptionsVisible(!moreOptionsVisible);
            }}
            icon={<EllipsisVertical size={22} color={colors.colorWhite} />}
          />
          {moreOptionsVisible && (
            <View
              style={{
                position: "absolute",
                top: 44,
                right: -15,
                backgroundColor: colors.colorPrimary,
                padding: 10,
                minWidth: 130,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <Text style={{ padding: 5, color: colors.colorWhite }}>
                Ação 1
              </Text>
              <Text style={{ padding: 5, color: colors.colorWhite }}>
                Ação 2
              </Text>
              <Text style={{ padding: 5, color: colors.colorWhite }}>
                Ação 3
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
