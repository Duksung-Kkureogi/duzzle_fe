import { Http } from "../Http";

export enum QuestType {
  SpeedQuiz = "SPEED_QUIZ",
  AcidRain = "ACID_RAIN",
  DuksaeJump = "DUKSAE_JUMP",
  PictureQuiz = "PICTURE_QUIZ",
  MusicQuiz = "MUSIC_QUIZ",
}

export interface StartRandomQuestResponse {
  type: QuestType;
  timeLimit: number;
  quest: string;
  logId: number;
}

export interface GetResultRequest {
  logId: number;
  answer: string[];
}

// TODO: 예외처리 추가
export const QuestApis = {
  /**
   * 퀘스트 시작하기
   */
  startQuest: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기(비회원)
   */
  startForGuest: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/guest/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 결과 제출하기
   */
  getResult: async (data: GetResultRequest) => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: boolean;
      }>("/v1/quest/result", data);

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 결과 제출하기(비회원)
   */
  getResultForGuest: async (data: GetResultRequest) => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: boolean;
      }>("/v1/quest/guest/result", data);

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
};

export const QuestApisForTest = {
  /**
   * 퀘스트 시작하기
   * - 산성비-스피드퀴즈 번갈아 나오는 퀘스트
   */
  startAcidRainSpeedQuest: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/acidrain-speed/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기
   * - 덕새점프만 나옴
   */
  startDuksaeJumpQuest: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/duksae-jump/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
};
