export default {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_FIREBASETOKEN(state, firebaseToken) {
    state.firebaseToken = firebaseToken
  },
  SET_USERDATA(state, userData) {
    state.userData = userData
  },
  SET_TOKENEXPIREDATE(state, date) {
    state.tokenExpDate = date;
  },
  SET_ROLES(state, date) {
    state.roles = date;
  },
  SET_PREDATA(state, date) {
    state.predata = date;
  },
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications;
  },
  PUSH_NOTIFICATION(state, newNotification) {
    let obj = {
      notificationBody: newNotification.body,
      notificationTitle: newNotification.title,
      creationDate: new Date(),
      calculationSheetId: parseInt(newNotification.calcSheetId),
      calculationSheetType: parseInt(newNotification.type),
      isRead: false,
      id: parseInt(newNotification.id)
    }
    let notifications = state.notifications.firebaseNotificationViewModel || [];
    notifications.unshift(obj)
    state.notifications = {
      firebaseNotificationViewModel: notifications,
      pagingInfo: {
        rowsCount: state.notifications.pagingInfo.rowsCount+1 || 1,
        unreadNotificationCount: state.notifications.pagingInfo.unreadNotificationCount+1 || 1,
      },
    }
  },
  MARK_AS_READ(state, notification) {
    let notifications = state.notifications.firebaseNotificationViewModel;
    let obj = notifications.find((x)=>x.id==notification.id);
    let index = notifications.findIndex((x)=>x.id==notification.id);
    if (obj) {
      obj.isRead = true;
      notifications.splice(index,1,obj);
      state.notifications = {
        firebaseNotificationViewModel: notifications,
        pagingInfo: {
          rowsCount: state.notifications.pagingInfo.rowsCount,
          unreadNotificationCount: state.notifications.pagingInfo.unreadNotificationCount-1,
        }
      }
    }
  }
}