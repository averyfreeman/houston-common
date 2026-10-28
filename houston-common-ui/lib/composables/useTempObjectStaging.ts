import {
  computed,
  ref,
  toRaw,
  unref,
  watch,
  type ComputedRef,
  type Ref,
  type UnwrapRef,
} from "vue";
import deepEqual from "deep-equal";

export interface TempObjectStaging<T> {
  tempObject: Ref<UnwrapRef<T>>;
  modified: ComputedRef<boolean>;
  resetChanges: () => void;
}

export const useTempObjectStaging = <T>(
  originalObject: Ref<T>,
  overrideDefaults?: (value: T) => T
): TempObjectStaging<T> => {
  const tempObject = ref(
    structuredClone(toRaw(unref(originalObject)))
  ) as Ref<UnwrapRef<T>>;

  if (overrideDefaults) {
    tempObject.value = overrideDefaults(tempObject.value as T) as UnwrapRef<T>;
  }

  watch(
    originalObject,
    (newObject) => {
      tempObject.value = structuredClone(toRaw(newObject)) as UnwrapRef<T>;
      if (overrideDefaults) {
        tempObject.value = overrideDefaults(tempObject.value as T) as UnwrapRef<T>;
      }
    },
    { deep: true }
  );

  const modified = computed<boolean>(() => !deepEqual(tempObject.value, unref(originalObject)));

  const resetChanges = () => {
    tempObject.value = structuredClone(toRaw(unref(originalObject))) as UnwrapRef<T>;
  };

  return { tempObject, modified, resetChanges };
};
