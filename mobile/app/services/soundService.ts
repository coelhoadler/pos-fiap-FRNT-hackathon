import { Audio } from "expo-av";

let backgroundSound: Audio.Sound | null = null;

/**
 * Configura o modo de áudio do app (chamar uma vez no início).
 */
export async function setupAudioMode(): Promise<void> {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
        });
    } catch (error) {
        console.error("Erro ao configurar áudio:", error);
    }
}

/**
 * Toca o som de conclusão (pomodoro_done.mp3) — dispara e esquece.
 */
export async function playDoneSound(): Promise<void> {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require("../../assets/audios/pomodoro_done.mp3"),
            { shouldPlay: true, volume: 0.3 }
        );

        // Libera o recurso quando o som terminar de tocar
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error("Erro ao tocar som de conclusão:", error);
    }
}

/**
 * Inicia a música de fundo do Pomodoro (looping).
 * Retorna o objeto Sound para controle externo.
 */
export async function playBackgroundMusic(): Promise<Audio.Sound | null> {
    try {
        if (backgroundSound) {
            await backgroundSound.playAsync();
            return backgroundSound;
        }

        const { sound } = await Audio.Sound.createAsync(
            require("../../assets/audios/pomodoro.m4a"),
            { shouldPlay: true, isLooping: true, volume: 0.3 }
        );

        backgroundSound = sound;
        return sound;
    } catch (error) {
        console.error("Erro ao tocar música de fundo:", error);
        return null;
    }
}

/**
 * Pausa a música de fundo.
 */
export async function pauseBackgroundMusic(): Promise<void> {
    try {
        if (backgroundSound) {
            await backgroundSound.pauseAsync();
        }
    } catch (error) {
        console.error("Erro ao pausar música de fundo:", error);
    }
}

/**
 * Para e descarrega a música de fundo completamente.
 */
export async function stopBackgroundMusic(): Promise<void> {
    try {
        if (backgroundSound) {
            await backgroundSound.stopAsync();
            await backgroundSound.unloadAsync();
            backgroundSound = null;
        }
    } catch (error) {
        console.error("Erro ao parar música de fundo:", error);
    }
}

/**
 * Retorna a instância atual da música de fundo (ou null).
 */
export function getBackgroundSound(): Audio.Sound | null {
    return backgroundSound;
}
