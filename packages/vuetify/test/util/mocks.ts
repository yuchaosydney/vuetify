import { ref } from 'vue'
import deepmerge from 'deepmerge'
import * as framework from '../../src/framework'

type NestedPartial<T> = {
  [P in keyof T]?: NestedPartial<T[P]>;
};

export const mockUseVuetify = (obj: NestedPartial<framework.VuetifyInstance> = {}) => {
  jest.spyOn(framework, 'useVuetify').mockImplementation(() => deepmerge({
    defaults: {
      global: {},
    },
    theme: {
      themes: ref({}),
      defaultTheme: ref(''),
      setTheme: jest.fn(),
    },
  }, obj as unknown as framework.VuetifyInstance, {
    isMergeableObject: value => !(value as any).__v_isRef,
  }))
}
