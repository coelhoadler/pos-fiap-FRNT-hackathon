import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendTasks } from "@/app/components/tasks/modalLegend";
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
import { createTask } from "@/app/services/tasks";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { CheckSquare, ChevronDown, Square } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { addTaskLegendContent } from "../constants";
import { createStyles } from "./styles";

export default function AddTask() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [openModalPriority, setOpenModalPriority] = useState(false);
  const [openModalColumn, setOpenModalColumn] = useState(false);
  const [openModalTime, setOpenModalTime] = useState(false);
  const [openModalStatus, setOpenModalStatus] = useState(false);
  const [openModalLegend, setOpenModalLegend] = useState(false);

  const [tempPriority, setTempPriority] = useState<TaskPriority>("baixa");
  const [tempStatus, setTempStatus] = useState<TaskStatus>("não iniciada");
  const [tempColumn, setTempColumn] = useState({ id: "", name: "" });
  const [projectColumns, setProjectColumns] = useState<IProjectServiceColumn[]>(
    [],
  );

  const params = useLocalSearchParams<{
    projectId: string;
    columnId: string;
    columnName: string;
  }>();

  const initialState = {
    nome: "",
    descricao: "",
    dataFinalizar: "",
    status: "não iniciada" as TaskStatus,
    priority: "baixa" as TaskPriority,
    columnId: params.columnId || "",
    columnName: params.columnName || "",
    hours: "0",
    minutes: "00",
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({
    nome: "",
    dataFinalizar: "",
    columnId: "",
  });

  const priorities: TaskPriority[] = ["baixa", "media", "alta", "urgente"];
  const statuses: TaskStatus[] = [
    "não iniciada",
    "em andamento",
    "concluída",
    "atrasada",
  ];
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutesOptions = ["00", "15", "30", "45"];

  const fetchProjectData = async () => {
    if (params.projectId) {
      const data = await getProjectById(params.projectId);
      if (data?.columns) setProjectColumns(data.columns);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setForm({
        ...initialState,
        columnId: params.columnId || "",
        columnName: params.columnName || "",
      });
      setErrors({ nome: "", dataFinalizar: "", columnId: "" });
      setSuccessMessage(false);
      setErrorMessage(false);
      setLoading(false);
      fetchProjectData();
      setOpenModalLegend(false);
    }, [params.columnId, params.columnName]),
  );

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${formatted.slice(0, 5)}/${cleaned.slice(4, 8)}`;
    setForm({ ...form, dataFinalizar: formatted });
    setErrors({ ...errors, dataFinalizar: "" });
  };

  const handleSave = async () => {
    let currentErrors = { nome: "", dataFinalizar: "", columnId: "" };
    let hasError = false;

    if (!form.nome.trim()) {
      currentErrors.nome = "O nome da tarefa é obrigatório";
      hasError = true;
    }

    if (!form.columnId) {
      currentErrors.columnId = "A coluna destino é obrigatória";
      hasError = true;
    }
    if (!form.dataFinalizar.trim()) {
      currentErrors.dataFinalizar = "A data finalizar é obrigatória";
      hasError = true;
    }

    if (form.dataFinalizar.length > 0) {
      if (form.dataFinalizar.length < 10) {
        currentErrors.dataFinalizar = "Formato inválido (DD/MM/AAAA)";
        hasError = true;
      } else {
        const [day, month, year] = form.dataFinalizar.split("/").map(Number);
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

    const user = auth().currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const tempoTotal = `${form.hours}h ${form.minutes}min`;
      await createTask(params.projectId, {
        nome: form.nome,
        descricao: form.descricao,
        tempoExecucao: tempoTotal,
        dataFinalizar: form.dataFinalizar,
        status: form.status,
        priority: form.priority,
        columnId: form.columnId,
        projectId: params.projectId,
        author: user.displayName || "Usuário",
      });
      setSuccessMessage(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Tabs.Screen
        options={{
          headerTitle: "Nova Tarefa",
          headerRight: () => (
            <ActionsButtonsProjects
              onlyInformationButton
              openModal={() => setOpenModalLegend(true)}
            />
          ),
        }}
      />
      <Text style={styles.title}>Criar Tarefa</Text>
      <Text style={styles.subtitle}>
        Preencha os campos abaixo para criar uma nova tarefa.
      </Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View>
            <Input
              text={
                <View
                  style={[
                    genericFormStyles(colorScheme).wrapperRequiredIndication,
                  ]}
                >
                  <Text
                    style={[genericFormStyles(colorScheme).requiredIndication]}
                  >
                    *
                  </Text>
                  <Text style={[genericFormStyles(colorScheme).defaultLabel]}>
                    Nome da tarefa
                  </Text>
                </View>
              }
              value={form.nome}
              onChangeText={(t) => {
                setForm({ ...form, nome: t });
                setErrors({ ...errors, nome: "" });
              }}
              placeholder="Ex: Criar tela de login"
            />
            {errors.nome ? <FormErrorMessage message={errors.nome} /> : null}
          </View>

          <View>
            <TextArea
              id="desc"
              text="Descrição"
              value={form.descricao}
              onChangeText={(t) => setForm({ ...form, descricao: t })}
              placeholder="Descreva a tarefa..."
            />
          </View>

          <View style={styles.selectedItems}>
            <TouchableOpacity
              style={styles.selectedItem}
              onPress={() => {
                setTempStatus(form.status);
                setOpenModalStatus(true);
              }}
            >
              <Text style={genericFormStyles(colorScheme).defaultLabel}>
                Status
              </Text>
              <View style={styles.selectedItemBody}>
                <Text style={styles.selectedItemBodyText}>{form.status}</Text>
                <ChevronDown size={20} color={colors.text} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectedItem}
              onPress={() => {
                setTempPriority(form.priority);
                setOpenModalPriority(true);
              }}
            >
              <Text style={genericFormStyles(colorScheme).defaultLabel}>
                Prioridade
              </Text>
              <View style={styles.selectedItemBody}>
                <Text style={styles.selectedItemBodyText}>{form.priority}</Text>
                <ChevronDown size={20} color={colors.text} />
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                style={styles.selectedItem}
                onPress={() => {
                  setTempColumn({ id: form.columnId, name: form.columnName });
                  setOpenModalColumn(true);
                  setErrors({ ...errors, columnId: "" });
                }}
              >
                <View
                  style={
                    genericFormStyles(colorScheme).wrapperRequiredIndication
                  }
                >
                  <Text
                    style={genericFormStyles(colorScheme).requiredIndication}
                  >
                    *
                  </Text>
                  <Text style={genericFormStyles(colorScheme).defaultLabel}>
                    Coluna Destino
                  </Text>
                </View>
                <View style={styles.selectedItemBody}>
                  <Text style={styles.selectedItemBodyText}>
                    {form.columnName || "Selecionar coluna"}
                  </Text>
                  <ChevronDown size={20} color={colors.text} />
                </View>
              </TouchableOpacity>
              {errors.columnId ? (
                <FormErrorMessage message={errors.columnId} />
              ) : null}
            </View>
          </View>

          <View>
            <Input
              text="Data para finalizar"
              value={form.dataFinalizar}
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
            title="Criar Tarefa"
            style={styles.modalButton}
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      {openModalLegend && (
        <ModalLegendTasks
          legendContentItems={addTaskLegendContent}
          subtitleContentItem="Explicando um pouco sobre a página de criação de tarefa."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}

      {/* Modal Status */}
      {openModalStatus && (
        <Modal
          onClose={() => setOpenModalStatus(false)}
          contentType="customModal"
          style={{ width: "100%" }}
        >
          <Text style={styles.titleModalOptions}>Selecione o Status</Text>
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
              setForm({ ...form, status: tempStatus });
              setOpenModalStatus(false);
            }}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {/* Modal Prioridade */}
      {openModalPriority && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalPriority(false)}
          contentType="customModal"
        >
          <Text style={styles.titleModalOptions}>Selecione a Prioridade</Text>
          {priorities.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setTempPriority(p)}
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
              setForm({ ...form, priority: tempPriority });
              setOpenModalPriority(false);
            }}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {/* Modal Coluna */}
      {openModalColumn && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalColumn(false)}
          contentType="customModal"
        >
          <Text style={styles.titleModalOptions}>Mover para Coluna</Text>
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
              setForm({
                ...form,
                columnId: tempColumn.id,
                columnName: tempColumn.name,
              });
              setOpenModalColumn(false);
            }}
            style={styles.modalOptionsButton}
          />
        </Modal>
      )}

      {/* Modal Tempo */}
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
                    onPress={() => setForm({ ...form, hours: h })}
                    style={[
                      styles.modalOptionsWrapperInfos,
                      {
                        padding: 10,
                        borderRadius: 5,
                        width: "92%",
                        backgroundColor:
                          form.hours === h
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
                            form.hours === h ? colors.colorWhite : colors.text,
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
                  onPress={() => setForm({ ...form, minutes: m })}
                  style={[
                    styles.modalOptionsWrapperInfos,
                    {
                      backgroundColor:
                        form.minutes === m
                          ? colors.colorPrimary
                          : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionsInfosText,
                      { color: form.minutes === m ? "#fff" : colors.text },
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
          text="Tarefa criada com sucesso!"
          onPress={() => router.back()}
        />
      )}
      {loading && (
        <Modal
          style={{ width: "100%" }}
          hasCloseButton={false}
          textLoading="Criando tarefa..."
          contentType="loading"
        />
      )}
    </ThemedView>
  );
}
