import API from './api';

export interface AppInfo {
  id: number;
  key: string;
  value: string;
}

export interface UpdateAppInfoDTO {
  key: string;
  value: string;
}

const AppInfoService = {
  getAllAppInfo: async (): Promise<AppInfo[]> => {
    const res = await API.get('/api/AppInfo');;
    return res.data;
  },

  getAppInfo: async (key: string): Promise<AppInfo> => {
    const res = await API.get(`/api/AppInfo/${key}`);
    return res.data;
  },

  updateAppInfo: async (data: UpdateAppInfoDTO): Promise<AppInfo> => {
    const res = await API.put('/api/AppInfo', data);
    return res.data;
  },
};

export default AppInfoService; 