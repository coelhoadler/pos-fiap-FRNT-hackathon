import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { TextArea } from "@/app/components/ui/textarea";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IProjectServiceColumn } from "@/app/interface/project";
import { TaskPriority, TaskStatus } from "@/app/interface/tasks";
import { getProjectById } from "@/app/services/projects";
import { updateTask } from "@/app/services/tasks";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckSquare, ChevronDown, Square } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export default function EditTask() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  const router = useRouter();

  const params = useLocalSearchParams<any>();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [openModalPriority, setOpenModalPriority] = useState(false);
  const [openModalColumn, setOpenModalColumn] = useState(false);
  const [openModalTime, setOpenModalTime] = useState(false);
  const [openModalStatus, setOpenModalStatus] = useState(false);

  const [tempPriority, setTempPriority] = useState<TaskPriority>("baixa");
  const [tempStatus, setTempStatus] = useState<TaskStatus>("não iniciada");
  const [tempColumn, setTempColumn] = useState({ id: "", name: "" });
  const [projectColumns, setProjectColumns] = useState<IProjectServiceColumn[]>(
    [],
  );
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutesOptions = ["00", "15", "30", "45"];

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    dataFinalizar: "",
    status: "não iniciada" as TaskStatus,
    priority: "baixa" as TaskPriority,
    columnId: "",
    columnName: "",
    hours: "0",
    minutes: "00",
  });

  const [errors, setErrors] = useState({ nome: "", dataFinalizar: "", columnId: "" });

  const statuses: TaskStatus[] = [
    "não iniciada",
    "em andamento",
    "concluída",
    "atrasada",
  ];

  const loadInitialData = async () => {
    let currentColumnName = "";
    let currentColumnId = params.columnId || "";

    if (params.projectId) {
      const data = await getProjectById(params.projectId);
      if (data?.columns) {
        setProjectColumns(data.columns);
        const currentCol = data.columns.find((c) => c.id === currentColumnId);
        if (currentCol) {
          currentColumnName = currentCol.name;
        }
      }
    }

    let h = "0";
    let m = "00";
    if (params.tempoExecucao) {
      const hMatch = params.tempoExecucao.match(/(\d+)h/);
      const mMatch = params.tempoExecucao.match(/(\d+)min/);
      if (hMatch) h = hMatch[1];
      if (mMatch) m = mMatch[1];
    }

    setFormData({
      nome: params.nome || "",
      descricao: params.descricao || "",
      dataFinalizar: params.dataFinalizar || "",
      status: (params.status as TaskStatus) || "não iniciada",
      priority: (params.priority as TaskPriority) || "baixa",
      columnId: currentColumnId,
      columnName: currentColumnName,
      hours: h,
      minutes: m,
    });

    setTempColumn({ id: currentColumnId, name: currentColumnName });
    setErrors({ nome: "", dataFinalizar: "", columnId: "" });
  };

  useFocusEffect(
    useCallback(() => {
      setSuccessMessage(false);
      setLoading(false);
      loadInitialData();
    }, [params.id, params.columnId]),
  );

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${formatted.slice(0, 5)}/${cleaned.slice(4, 8)}`;
    setFormData({ ...formData, dataFinalizar: formatted });
    setErrors({ ...errors, dataFinalizar: "" });
  };

  const handleUpdate = async () => {
    let currentErrors = { nome: "", dataFinalizar: "", columnId: "" };
    let hasError = false;

    if (!formData.nome.trim()) {
      currentErrors.nome = "O nome da tarefa é obrigatório";
      hasError = true;
    }

    if (!formData.columnId) {
      currentErrors.columnId = "A coluna destino é obrigatória";
      hasError = true;
    }

    if (formData.dataFinalizar.length > 0) {
      if (formData.dataFinalizar.length < 10) {
        currentErrors.dataFinalizar = "Formato inválido (DD/MM/AAAA)";
        hasError = true;
      } else {
        const [day, month, year] = formData.dataFinalizar
          .split("/")
          .map(Number);
        const inputDate = new Date(year, month - 1, day);

        const isValidDate =
          inputDate.getFullYear() === year &&
          inputDate.getMonth() === month - 1 &&
          inputDate.getDate() === day;
        const errorDateText = "Insira uma data válida";

        if (!isValidDate) {
          currentErrors.dataFinalizar = errorDateText;
          hasError = true;
        } else if (year > 2100) {
          currentErrors.dataFinalizar = errorDateText;
          hasError = true;
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (inputDate < today) {
            currentErrors.dataFinalizar = errorDateText;
            hasError = true;
          }
        }
      }
    }

    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    try {
      const tempoTotal = `${formData.hours}h ${formData.minutes}min`;
      await updateTask(params.projectId, params.id, {
        nome: formData.nome,
        descricao: formData.descricao,
        tempoExecucao: tempoTotal,
        dataFinalizar: formData.dataFinalizar,
        status: formData.status,
        priority: formData.priority,
        columnId: formData.columnId,
      });
      setSuccessMessage(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Text style={styles.subtitle}>
        Preencha os campos abaixo para editar a tarefa.
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.formContainer}
      >
        <View style={styles.form}>
          <View>
            <Input
              text="Nome da tarefa"
              value={formData.nome}
              onChangeText={(t) => {
                setFormData({ ...formData, nome: t });
                setErrors({ ...errors, nome: "" });
              }}
            />
            {errors.nome ? <FormErrorMessage message={errors.nome} /> : null}
          </View>
          <View>
            <TextArea
              id="edit-desc"
              text="Descrição"
              value={formData.descricao}
              onChangeText={(t) => setFormData({ ...formData, descricao: t })}
            />
          </View>

          <View style={styles.selectedItems}>
            <TouchableOpacity
              style={styles.selectedItem}
              onPress={() => {
                setTempStatus(formData.status);
                setOpenModalStatus(true);
              }}
            >
              <Text style={genericFormStyles(colorScheme).defaultLabel}>
                Status
              </Text>
              <View style={styles.selectedItemBody}>
                <Text style={styles.selectedItemBodyText}>
                  {formData.status}
                </Text>
                <ChevronDown size={20} color={colors.text} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectedItem}
              onPress={() => {
                setTempPriority(formData.priority);
                setOpenModalPriority(true);
              }}
            >
              <Text style={genericFormStyles(colorScheme).defaultLabel}>
                Prioridade
              </Text>
              <View style={styles.selectedItemBody}>
                <Text style={styles.selectedItemBodyText}>
                  {formData.priority}
                </Text>
                <ChevronDown size={20} color={colors.text} />
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                style={styles.selectedItem}
                onPress={() => {
                  setTempColumn({
                    id: formData.columnId,
                    name: formData.columnName,
                  });
                  setOpenModalColumn(true);
                  setErrors({ ...errors, columnId: "" });
                }}
              >
                <View style={genericFormStyles(colorScheme).wrapperRequiredIndication}>
                  <Text style={genericFormStyles(colorScheme).requiredIndication}>*</Text>
                  <Text style={genericFormStyles(colorScheme).defaultLabel}>
                    Coluna Destino
                  </Text>
                </View>
                <View style={styles.selectedItemBody}>
                  <Text style={styles.selectedItemBodyText}>
                    {formData.columnName || "Selecionar coluna"}
                  </Text>
                  <ChevronDown size={20} color={colors.text} />
                </View>
              </TouchableOpacity>
              {errors.columnId ? <FormErrorMessage message={errors.columnId} /> : null}
            </View>
          </View>

          <View>
            <Input
              text="Data para finalizar"
              value={formData.dataFinalizar}
              onChangeText={handleDateChange}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.dataFinalizar ? (
              <FormErrorMessage message={errors.dataFinalizar} />
            ) : null}
          </View>

          <Button
            title="Salvar Alterações"
            onPress={handleUpdate}
            loading={loading}
            style={styles.modalButton}
          />
        </View>
      </ScrollView>

      {/* Modal Status */}
      {openModalStatus && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalStatus(false)}
          contentType="customModal"
        >
          <Text style={styles.titleModalOptions}>Alterar Status</Text>
          {statuses.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setTempStatus(s)}
              style={[
                styles.modalOptions,
                {
                  borderBottomColor:
                    tempStatus === s ? colors.colorPrimary : colors.text,
                },
              ]}
            >
              <Text style={styles.modalOptionsText}>{s}</Text>
              {tempStatus === s ? (
                <CheckSquare size={20} color={colors.colorPrimary} />
              ) : (
                <Square size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          ))}
          <Button
            title="Confirmar"
            onPress={() => {
              setFormData({ ...formData, status: tempStatus });
              setOpenModalStatus(false);
            }}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {/* Modal Priority */}
      {openModalPriority && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalPriority(false)}
          contentType="customModal"
        >
          <Text style={styles.titleModalOptions}>Prioridade</Text>
          {["baixa", "media", "alta", "urgente"].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setTempPriority(p as any)}
              style={[
                styles.modalOptions,
                {
                  borderBottomColor:
                    tempPriority === p ? colors.colorPrimary : colors.text,
                },
              ]}
            >
              <Text style={styles.modalOptionsText}>{p}</Text>
              {tempPriority === p ? (
                <CheckSquare size={20} color={colors.colorPrimary} />
              ) : (
                <Square size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          ))}
          <Button
            title="Confirmar"
            onPress={() => {
              setFormData({ ...formData, priority: tempPriority });
              setOpenModalPriority(false);
            }}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {/* Modal Column */}
      {openModalColumn && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalColumn(false)}
          contentType="customModal"
        >
          <Text style={styles.titleModalOptions}>Alterar Coluna</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {projectColumns.map((col) => (
              <TouchableOpacity
                key={col.id}
                onPress={() => setTempColumn({ id: col.id, name: col.name })}
                style={[
                  styles.modalOptions,
                  {
                    borderBottomColor:
                      tempColumn.id === col.id
                        ? colors.colorPrimary
                        : colors.text,
                  },
                ]}
              >
                <Text style={styles.modalOptionsText}>{col.name}</Text>
                {tempColumn.id === col.id ? (
                  <CheckSquare size={20} color={colors.colorPrimary} />
                ) : (
                  <Square size={20} color={colors.text} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button
            title="Confirmar"
            onPress={() => {
              setFormData({
                ...formData,
                columnId: tempColumn.id,
                columnName: tempColumn.name,
              });
              setOpenModalColumn(false);
            }}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {/* Modal Time */}
      {openModalTime && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalTime(false)}
          contentType="customModal"
        >
          <Text style={styles.titleModalOptions}>Tempo Estimado</Text>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalOptionsSubtitle}>Horas</Text>
              <ScrollView style={{ maxHeight: 200 }}>
                {hoursOptions.map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => setFormData({ ...formData, hours: h })}
                    style={[
                      styles.modalOptionsWrapperInfos,
                      {
                        backgroundColor:
                          formData.hours === h
                            ? colors.colorPrimary
                            : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalOptionsInfosText,
                        {
                          color:
                            formData.hours === h
                              ? colors.colorWhite
                              : colors.text,
                        },
                      ]}
                    >
                      {h}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalOptionsSubtitle}>Minutos</Text>
              {minutesOptions.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setFormData({ ...formData, minutes: m })}
                  style={[
                    styles.modalOptionsWrapperInfos,
                    {
                      backgroundColor:
                        formData.minutes === m
                          ? colors.colorPrimary
                          : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionsInfosText,
                      {
                        color:
                          formData.minutes === m
                            ? colors.colorWhite
                            : colors.text,
                      },
                    ]}
                  >
                    {m}min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Button
            title="Confirmar"
            onPress={() => setOpenModalTime(false)}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {successMessage && (
        <Modal
          style={{ width: "100%" }}
          contentType="feedbackMessage"
          text="Tarefa atualizada!"
          onPress={() => router.back()}
        />
      )}
      {loading && (
        <Modal
          style={{ width: "100%" }}
          hasCloseButton={false}
          contentType="loading"
        />
      )}
    </ThemedView>
  );
}
