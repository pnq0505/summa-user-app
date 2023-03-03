export const migrations = (initData) => {
  return {
    3: (state) => {
      return {
        ...state,
        unsaveProjectInfo: {},
      };
    },
  };
};
