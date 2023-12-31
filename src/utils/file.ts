export const fileInterceptorOption = {
  storage: {
    destination: process.cwd() + '/public',
    filename: (_, file, callback) => {
      callback(null, new Date().getTime() + '_' + file.originalname);
    },
  },
};
