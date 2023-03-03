export const cleanData = (version, initData) => {
  return {
    [version]: (state) => ({
      ...state,
      ...initData,
    }),
  }
};

export const storeVersion = 2.1;
