import { type InjectionKey, type Ref } from "vue";
import SurveyContent from "@/components/SurveyContent.vue";

export const saveToolInjectionKey = Symbol() as InjectionKey<{
  addSaveItem: (key: string | Symbol, fn: () => Promise<any>) => void;
  saveAll: () => void;
  hasSaved: Ref<boolean>;
}>;

export const surveyContentRefInjectionKey = Symbol() as InjectionKey<
  Ref<InstanceType<typeof SurveyContent>>
>;
