import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { ISummaryCard } from "@/app/interface/tasks";
import {
  Calendar,
  Eye,
  Pencil,
  Play,
  Timer,
  Trash2,
  User,
} from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./styles";
import { useTaskTimer } from "../taskTimer/task-timer-context";

export const SummaryCard: React.FC<ISummaryCard> = ({
  style,
  title,
  colorIcon,
  onPressView,
  description,
  sizeIcon = 18,
  author,
  date,
  time,
  onPressDelete,
  onPressEdit,
  onPressPlay,
  ...props
}) => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];
  const styles = createStyles(colorScheme);
  const { isRunning } = useTaskTimer();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.headerIconWrapper}>
            {onPressPlay && !isRunning && (
              <Pressable onPress={onPressPlay}>
                <Play
                  size={sizeIcon}
                  color="#4CAF50"
                  fill="#4CAF50"
                />
              </Pressable>
            )}
            <Pressable onPress={onPressDelete}>
              <Trash2
                size={sizeIcon}
                color={colorIcon ? colorIcon : colors.colorWhite}
              />
            </Pressable>
            <Pressable onPress={onPressEdit}>
              <Pencil
                size={sizeIcon}
                color={colorIcon ? colorIcon : colors.colorWhite}
              />
            </Pressable>
            <Pressable onPress={onPressView}>
              <Eye
                size={sizeIcon}
                color={colorIcon ? colorIcon : colors.colorWhite}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          {description && (
            <Text
              ellipsizeMode="tail"
              numberOfLines={3}
              style={styles.description}
            >
              {description}
            </Text>
          )}

          <View style={{ marginTop: 15 }}>
            <View style={styles.wrapperInfos}>
              {author && (
                <View style={styles.infosItem}>
                  <User
                    size={sizeIcon}
                    color={colorIcon ? colorIcon : colors.colorWhite}
                  />
                  <Text style={styles.textInfo}>{author}</Text>
                </View>
              )}

              {time && (
                <View style={styles.infosItem}>
                  <Timer
                    size={sizeIcon}
                    color={colorIcon ? colorIcon : colors.colorWhite}
                  />
                  <Text style={styles.textInfo}>{time}</Text>
                </View>
              )}

              {date && (
                <View style={styles.infosItem}>
                  <Calendar
                    size={sizeIcon}
                    color={colorIcon ? colorIcon : colors.colorWhite}
                  />
                  <Text style={styles.textInfo}>{date}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
