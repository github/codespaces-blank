module.exports = {
  packagers: [
    {
      name: '@electron-forge/packager',
      config: {
        name: 'todolist',
        win32metadata: {
          ProductName: 'ToDo List',
          CompanyName: 'ToDo App',
          FileDescription: 'A Windows To-Do List application',
        },
      },
    },
  ],
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'todolist',
        setupIcon: null,
      },
    },
  ],
  publishers: [],
};
