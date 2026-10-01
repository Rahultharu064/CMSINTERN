import axios from '../utils/axios.js';

const API_URL = '/notification';

const unwrap = (response) => response?.data?.data ?? response?.data ?? response;

export const getNotifications = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return unwrap(response);
};

export const getUnreadCount = async () => {
  const raw = unwrap((await axios.get(`${API_URL}/unread-count`)));
  const value =
    typeof raw?.unreadCount === 'number'
      ? raw.unreadCount
      : typeof raw?.count === 'number'
      ? raw.count
      : typeof raw === 'number'
      ? raw
      : 0;
  return { unreadCount: value, count: value };
};

export const markAsRead = async (notificationId) => {
  const response = await axios.patch(`${API_URL}/${notificationId}/read`);
  return unwrap(response);
};

export const markAllAsRead = async () => {
  const response = await axios.patch(`${API_URL}/mark-all-read`);
  return unwrap(response);
};

export const deleteNotification = async (notificationId) => {
  const response = await axios.delete(`${API_URL}/${notificationId}`);
  return unwrap(response);
};

export const clearAllNotifications = async () => {
  const response = await axios.delete(`${API_URL}/clear-all`);
  return unwrap(response);
};

export const createNotification = async (payload) => {
  const response = await axios.post(API_URL, payload);
  return unwrap(response);
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
};
