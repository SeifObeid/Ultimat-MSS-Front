export default {
  callingAPI: false,
  searching: '',
  //serverURI: 'http://10.110.1.136:8080',
  serverURI: 'http://localhost/MSS/', 
  // serverURI: 'https://tms.mss.ps/',
  // serverURI: 'http://192.168.0.93/MSS/',
  // serverURI: 'http://192.168.5.34:8081/mss_test/',
 //  serverURI: 'http://192.168.5.34:8087/',//mss test
  // serverURI: 'http://192.168.0.185/MSS/',
  
  user: null,
  token: null,
  firebaseToken: null,
  dateFormat: "dd/MM/yyyy",
  dateTimeFormat: "dd/MM/yyyy HH:mm:ss",
  webAPIDateFormat: "M/d/yyyy",
  webAPIDateTimeFormat: "YYYY-MM-DD HH:mm:ss.SSS",//"d/M/yyyy HH:mm:ss",//"YYYY-MM-DDTHH:mm:ss.sssZ",//YYYYYY-MM-DDTHH:mm:ss.sssZ
  defaultTime: '00:00:00',
  attachmentMimes: ['jpeg', 'png', 'pdf', 'xls'],
  attachmentSize: 20480 ,
  userInfo: {
    messages: [{ 1: 'test', 2: 'test' }],
    notifications: [],
    tasks: []
  },
  pagging: {
    large: 15,
    small: 5,
    medium: 8
  },
  messagesDuration: 10000,
  LookupCategory: {
    TypeOfEvent: 1, 
    TenderLocation: 2, 
    Validity: 3, 
    CostType: 4, 
    GuaranteType: 6, 
    Currency: 5, 
    WorkflowType: 8, 
    StepType: 9, 
    ActionType: 10,
    priceQouteType: 11, 
    assignToType: 12, 
    stageType: 13,
    Position:18,
    Department:17,
    BankGuarantee: 19, 
    country: 20,
    LabBankGuarantee: 25,
    CalculationSheetBankGuarantee: 26,
    Alternative: 27,
    Warranty: 28,
    MECalBasicBankGuaranteeType: 29,
  },
  workflowType:{
    medical:22,
    tender:48,
    lab:67
  },
  departmentCode:{
    medical:1,
    tender:2,
    lab:3
  },
  workflowTypes:[
    {id:22,code:1,name:"medical"},
    {id:48,code:2,name:"tender"},
    {id:67,code:3,name:"lab"}
  ]  ,
  TypeOfEventLookup: { Tender: 1, Event: 2 },
  SystemSettings: {
    NumberOfAutoFillRows: 5
  },
  // represents the code field
  userData: {
    firstName: '',
    lastName: '',
    userName: '',
    terminalId: '',
    cashCustomerCode: '',
    billingAccount: '',
    customerBillingType: '',
    cashBackType: '',
    email: '',
    userDefault: {
      billToId: '',
      codCurrency: '',
      codType: '',
      serviceCategoryId: '',
      serviceSubCategoryId: '',
      codDelivery: '',
      codAmount: '',
      serviceTypeId: '',
      pickupDropOffId: '',
    }
  },
  //StepsTypes2:{1:"First step",2:"Normal step",3:"Last step rejected",4:"Last step approved"},
  StepsTypes: [{ code: 1, Name: "First step" }, { code: 2, Name: "Normal step" }, { code: 3, Name: "Last step rejected" }, { code: 4, Name: "Last step approved" }],
  LookupStepsTypes: {
    FirstStep: 1, NormalStep: 2, LastStepRejected: 3, LastStepApproved: 4
  },
  ActionTypes: [{ code: 1, Name: "Approve" }, { code: 2, Name: "Reject" }],
  tokenExpDate: null,
  errorCode: 460,
  returnPerPage: 30,
  SheetStatus:{
    New:1,
    Draft:2,
    Waiting_for_Approval:3,
    Approved:4,
    Rejected:5,
    Rejected_Closed:6,
    Awarded:7

  },
  maxLength:{
    length10:10,
    length20:20,
    length30:30,
    length40:40,
    length50:50,
    length100:100,
    length200:200,
    length300:300
  },
  predata:null,
  calculatedItem:{
    cif:1,
    factor:2,
    suggestedQuotedPrice:3
  },
  notifications: null,
}