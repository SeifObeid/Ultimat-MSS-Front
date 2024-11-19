export default {
  serverURI(state) {
    return state.serverURI;
  },
  tokenAuthonticationHeader(state) {
    return 'Bearer ' + state.token;
  },
  tokenAuthonticationHeaderObj(state) {
    return {
      'Authorization': 'Bearer ' + state.token
    }
  },
  getToken(state){
    return state.token;
  },
  getDateFormat(state) {
    return state.dateFormat;
  },
  getDateFormatMoment(state) {
    return state.dateFormat.toUpperCase();
  },
  getWebAPIDateFormatMoment(state) {
    return state.webAPIDateFormat.toUpperCase();
  },
  getDateTimeFormat(state) {
    return state.dateTimeFormat;
  },
  getWebAPIDateTimeFormatMoment(state) {
    return state.webAPIDateTimeFormat.toUpperCase();
  },
  getWebAPIDateTimeFormat(state) {
    return state.webAPIDateTimeFormat;
  },
  getDefaultTime(state) {
    return state.defaultTime;
  },
  getAttachmentMimes(state) {
    return state.attachmentMimes;
  },
  getAttachmentSize(state) {
    return state.attachmentSize;
  },
  getLargePagging(state) {
    return state.pagging["large"];
  },
  getSmallPagging(state) {
    return state.pagging["small"];
  },
  getMediumPagging(state) {
    return state.pagging["medium"];
  },
  getMessagesDuration(state){
    return state.messagesDuration;
  },
  getLookupCategory(state){
    return state.LookupCategory;
  },
  getWorkflowType(state){
    return state.workflowType
  },
  getWorkflowTypes(state){
    return state.workflowTypes
  },
  getTypeOfEventLookup(state){
    return state.TypeOfEventLookup;
  },
  getSystemSettings(state){
    return state.SystemSettings;
  },
  getUserData(state){
    return state.userData;
  },
  getUserRole(state){
    return state.roles;
  },
  getStepType(state){
    return state.StepsTypes;
  },
  getLookupStepsTypes(state){
    return state.LookupStepsTypes;
  },
  getActionTypes(state){
    return state.ActionTypes;
  },
  getTokenExpDate(state){
    return state.tokenExpDate;
  },
  getErrorCode(state){
    return state.errorCode;
  },
  getReturnPage(state){
    return state.returnPerPage;
  },
  getSheetStatus(state){
    return state.SheetStatus;
  }, 
  getMaxLength(state){
    return state.maxLength
  },
  getPredata(state){
    return state.predata
  },
  getDepartmentCode(state){
    return state.departmentCode
  },
  getCalculatedItem(state){
    return state.calculatedItem
  },
  getNotifications(state){
    return state.notifications;
  },
  getDepartmentCodeWithRouterName() {
    return [
      {
        department: "medical",
        code: 1,
        name: "viewCalculationSheet"
      },
      {
        department: "tender",
        code: 2,
        name: "tenderViewCalculationSheet"
      },
      {
        department: "lab",
        code: 3,
        name: "LabViewCalculationSheet"
      }
    ]
  }
}
