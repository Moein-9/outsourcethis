import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'ar';
  t: (key: keyof Translations) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

interface Translations {
  invoice: string;
  patient: string;
  date: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  paid: string;
  unpaid: string;
  invoiceId: string;
  customerName: string;
  customerPhone: string;
  amountPaid: string;
  remainingAmount: string;
  makePayment: string;
  selectPaymentMethod: string;
  cash: string;
  knet: string;
  creditCard: string;
  paymentSuccessful: string;
  paymentFailed: string;
  printReceipt: string;
  enterAmount: string;
  enterAuthNumber: string;
  authNumber: string;
  depositReceived: string;
  addPayment: string;
  editInvoice: string;
  saveChanges: string;
  cancel: string;
  invoiceDetails: string;
  workOrderDetails: string;
  additionalNotes: string;
  contactLens: string;
  lensType: string;
  lensPrice: string;
  frame: string;
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize: string;
  framePrice: string;
  coating: string;
  coatingPrice: string;
  discount: string;
  total: string;
  deposit: string;
  remaining: string;
  payment: string;
  createdAt: string;
  isPaid: string;
  isPickedUp: string;
  pickedUpAt: string;
  lastEditedAt: string;
  editHistory: string;
  timestamp: string;
  notes: string;
  glasses: string;
  contacts: string;
  search: string;
  noResults: string;
  select: string;
  refundAmount: string;
  refundMethod: string;
  refundReason: string;
  additionalNotesForRefund: string;
  processRefund: string;
  refundProcessedSuccessfully: string;
  errorProcessingRefund: string;
  missingData: string;
  selectRefundMethod: string;
  enterRefundReason: string;
  refund: string;
  refundReceipt: string;
  thankYou: string;
  refundId: string;
  invoiceIdLabel: string;
  customerLabel: string;
  dateLabel: string;
  amountRefunded: string;
  refundMethodLabel: string;
  reasonLabel: string;
  refundProcessed: string;
  receiptSentToPrinter: string;
  processingPrintRequest: string;
  refundInformation: string;
  totalInvoiceAmount: string;
  selectReason: string;
  customerDissatisfied: string;
  productDefect: string;
  incorrectPrescription: string;
  frameExchange: string;
  billingError: string;
  other: string;
  staffNotes: string;
  archive: string;
  deleteOrder: string;
  reasonForDeletion: string;
  confirmDeletion: string;
  orderDeletedSuccessfully: string;
  orderDeletionFailed: string;
  workOrder: string;
  workOrders: string;
  active: string;
  completed: string;
  transactionHistory: string;
  transactions: string;
  noActiveOrders: string;
  noCompletedOrders: string;
  noRefundedTransactions: string;
  noArchivedOrders: string;
  printInvoice: string;
  printWorkOrder: string;
  markAsPickedUp: string;
  orderPickedUpSuccessfully: string;
  anonymous: string;
  areYouSure: string;
  thisActionCannotBeUndone: string;
  delete: string;
  deleted: string;
  archived: string;
  refunded: string;
  refundInfo: string;
  amount: string;
  dailySalesReport: string;
  overviewOfSales: string;
  sales: string;
  payments: string;
  salesInfo: string;
  totalSales: string;
  patientName: string;
  paymentInfo: string;
  totalPayments: string;
  paymentDate: string;
  invoiceNumber: string;
  workOrderNumber: string;
  refundDate: string;
  refundsTab: string;
  method: string;
  kwd: string;
  currency: string;
  name: string;
  phone: string;
  phoneNumber: string;
  dateOfBirth: string;
  axisValidationError: string;
  contactLensPrescription: string;
  noContactLensRx: string;
  rightEye: string;
  leftEye: string;
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  error: string;
  requiredField: string;
  success: string;
  successMessage: string;
  createClientTitle: string;
  prescriptionGlasses: string;
  contactLensesTab: string;
  personalInfo: string;
  fullName: string;
  day: string;
  month: string;
  year: string;
  clientDidntShareDOB: string;
  notesPlaceholder: string;
  glassesPrescription: string;
  prescriptionDate: string;
  choosePrescriptionDate: string;
  choose: string;
  saveAndContinue: string;
  invoiceTitle: string;
  clientSection: string;
  productSection: string;
  paymentSection: string;
  summarySection: string;
  next: string;
  previous: string;
  invoiceSummary: string;
  clientInformation: string;
  waitingForClientData: string;
  thickness: string;
  quantity: string;
  waitingForProductData: string;
  subtotal: string;
  paidInFull: string;
  waitingForPaymentData: string;
  print: string;
  close: string;
  printing: string;
  workOrderPreview: string;
  previewBeforePrinting: string;
  startBySelectingClient: string;
  customer: string;
  welcome: string;
  systemDescription: string;
  reportsPage: string;
  currentTime: string;
  eye: string;
  rightEyeAbbr: string;
  leftEyeAbbr: string;
  color: string;
  size: string;
  edit: string;
  copy: string;
  noFramesMatchingSearch: string;
  pleaseEnterCompleteFrameDetails: string;
  pleaseEnterValidPrice: string;
  pleaseEnterValidQuantity: string;
  searchForFrame: string;
  printLabels: string;
  addNewFrame: string;
  addNewFrameTitle: string;
  addNewFrameDescription: string;
  brand: string;
  brandExample: string;
  model: string;
  modelExample: string;
  colorExample: string;
  sizeExample: string;
  price: string;
  saveFrame: string;
  noFramesFound: string;
  showAllFrames: string;
  printFrameLabels: string;
  selectFramesForLabels: string;
  frameNotFound: string;
  labelPrintedSuccessfully: string;
  errorGeneratingQRCode: string;
  noFramesSelected: string;
  labelsPrintedSuccessfully: string;
  errorGeneratingQRCodes: string;
  selectedFrames: string;
  selectAll: string;
  deselectAll: string;
  printSelected: string;
  selectFramesToPrint: string;
  labelPreview: string;
  noFramesAvailable: string;
  frames: string;
  contactLenses: string;
  lensTypes: string;
  lensCoatings: string;
  lensThicknesses: string;
  frameManagement: string;
  contactLensManagement: string;
  dashboard: string;
  createClient: string;
  createInvoice: string;
  inventory: string;
  remainingPayments: string;
  patientSearch: string;
  fillRequiredFields: string;
  coatingAddedSuccess: string;
  coatingUpdatedSuccess: string;
  coatingDeletedSuccess: string;
  distanceReading: string;
  progressive: string;
  bifocal: string;
  addCoating: string;
  addNewCoatingTitle: string;
  addNewCoatingDescription: string;
  coatingName: string;
  coatingNameExample: string;
  description: string;
  coatingDescription: string;
  category: string;
  chooseCategory: string;
  save: string;
  noCoatings: string;
  editCoating: string;
  updateCoatingDetails: string;
  skipLens: string;
  selectLensType: string;
  selectCoatings: string;
  selectThickness: string;
  noCoating: string;
  noCoatingDesc: string;
  selectLensTypeFirst: string;
  noThickness: string;
  noThicknessDesc: string;
  lensSkipped: string;
  addLens: string;
  thicknessAddedSuccess: string;
  thicknessUpdatedSuccess: string;
  thicknessDeletedSuccess: string;
  thicknessName: string;
  thicknessNameExample: string;
  thicknessDescription: string;
  noThicknessesInCategory: string;
  addThickness: string;
  editThickness: string;
  updateThicknessDetails: string;
  lensAddedSuccess: string;
  lensUpdatedSuccess: string;
  lensDeletedSuccess: string;
  distance: string;
  reading: string;
  sunglasses: string;
  addNewLensTitle: string;
  addNewLensDescription: string;
  lensName: string;
  lensNameExample: string;
  type: string;
  chooseType: string;
  noLensesInCategory: string;
  editLensType: string;
  updateLensDetails: string;
  noteEmpty: string;
  noteAdded: string;
  noteDeleted: string;
  noteUpdated: string;
  patientNotes: string;
  noNotesYet: string;
  addNoteBelow: string;
  addNoteHere: string;
  addNote: string;
  dataError: string;
  fillAllRequiredFields: string;
  noteCannotBeEmpty: string;
  noteAddedSuccessfully: string;
  rxAndCareInstructions: string;
  printPrescription: string;
  newRx: string;
  currentRx: string;
  addNewNote: string;
  enterNoteAboutPatient: string;
  noNotes: string;
  addNotesToTrackInfo: string;
  rxHistory: string;
  pupillaryDistance: string;
  actions: string;
  right: string;
  left: string;
  view: string;
  noPreviousRx: string;
  noPreviousRxDescription: string;
  glassesCareTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  addNewRx: string;
  addNewRxFor: string;
  viewPrescription: string;
  searchClient: string;
  searchResults: string;
  age: string;
  pendingOrders: string;
  completedOrders: string;
  noPendingOrders: string;
  notPickedUp: string;
  lens: string;
  edited: string;
  printPreview: string;
  invoiceSaved: string;
  errorSavingInvoice: string;
  saving: string;
  glassesDetails: string;
  contactLensDetails: string;
  item: string;
  noProductDetails: string;
  duePayments: string;
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  selectLanguageForPrinting: string;
  workOrderUpdated: string;
  errorUpdatingWorkOrder: string;
  editWorkOrder: string;
  selectFrameBrand: string;
  selectFrameModel: string;
  selectFrameColor: string;
  selectLensType: string;
  selectCoating: string;
  patientId: string;
  patientInformation: string;
  frameDetails: string;
  prescriptionDetails: string;
  lensDetails: string;
  thicknessPrice: string;
  technicianSignature: string;
  qualityConfirmation: string;
  orderNumber: string;
  printingCompleted: string;
  printingFailed: string;
  selectPrintFormat: string;
  choosePrintFormatDescription: string;
  paper: string;
  standardFormat: string;
  receiptFormat: string;
  compactFormat: string;
  notSpecified: string;
  phoneSearchError: string;
  noClientsFound: string;
  noClientFile: string;
  phoneColon: string;
  typeToSearch: string;
  clientName: string;
  clientPhone: string;
  patientID: string;
  hideRx: string;
  showRx: string;
  optional: string;
  paymentMethodError: string;
  orderSavedSuccess: string;
  discountSection: string;
  discountColon: string;
  depositColon: string;
  payInFull: string;
  visa: string;
  mastercard: string;
  approvalNumber: string;
  totalInvoice: string;
  searchTermError: string;
  frameDetailsError: string;
  priceError: string;
  quantityError: string;
  frameAddedSuccess: string;
  contactLensesTotal: string;
  lensCount: string;
  lensSection: string;
  frameSection: string;
  searchTerm: string;
  searchExample: string;
  selectedFrame: string;
  addFrameButton: string;
  newFrameDetails: string;
  pieces: string;
  invoiceCreated: string;
  invoiceSuccessMessage: string;
  orderType: string;
  partiallyPaid: string;
  nextSteps: string;
  printWorkOrderDescription: string;
  printInvoiceDescription: string;
  refundMethod: string;
  refundId: string;
  goToClientSection: string;
  refreshPrintPage: string;
}

const translations: { [key: string]: Translations } = {
  en: {
    invoice: 'Invoice',
    patient: 'Patient',
    date: 'Date',
    totalAmount: 'Total Amount',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    paid: 'Paid',
    unpaid: 'Unpaid',
    invoiceId: 'Invoice ID',
    customerName: 'Customer Name',
    customerPhone: 'Customer Phone',
    amountPaid: 'Amount Paid',
    remainingAmount: 'Remaining Amount',
    makePayment: 'Make Payment',
    selectPaymentMethod: 'Select Payment Method',
    cash: 'Cash',
    knet: 'KNET',
    creditCard: 'Credit Card',
    paymentSuccessful: 'Payment Successful',
    paymentFailed: 'Payment Failed',
    printReceipt: 'Print Receipt',
    enterAmount: 'Enter Amount',
    enterAuthNumber: 'Enter Auth Number',
    authNumber: 'Auth Number',
    depositReceived: 'Deposit Received',
    addPayment: 'Add Payment',
    editInvoice: 'Edit Invoice',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    invoiceDetails: 'Invoice Details',
    workOrderDetails: 'Work Order Details',
    additionalNotes: 'Additional Notes',
    contactLens: 'Contact Lens',
    lensType: 'Lens Type',
    lensPrice: 'Lens Price',
    frame: 'Frame',
    frameBrand: 'Frame Brand',
    frameModel: 'Frame Model',
    frameColor: 'Frame Color',
    frameSize: 'Frame Size',
    framePrice: 'Frame Price',
    coating: 'Coating',
    coatingPrice: 'Coating Price',
    discount: 'Discount',
    total: 'Total',
    deposit: 'Deposit',
    remaining: 'Remaining',
    payment: 'Payment',
    createdAt: 'Created At',
    isPaid: 'Is Paid',
    isPickedUp: 'Is Picked Up',
    pickedUpAt: 'Picked Up At',
    lastEditedAt: 'Last Edited At',
    editHistory: 'Edit History',
    timestamp: 'Timestamp',
    notes: 'Notes',
    glasses: 'Glasses',
    contacts: 'Contacts',
    search: 'Search',
    noResults: 'No Results',
    select: 'Select',
    refundAmount: 'Refund Amount',
    refundMethod: 'Refund Method',
    refundReason: 'Refund Reason',
    additionalNotesForRefund: 'Additional Notes for Refund',
    processRefund: 'Process Refund',
    refundProcessedSuccessfully: 'Refund Processed Successfully',
    errorProcessingRefund: 'Error Processing Refund',
    missingData: 'Missing Data',
    selectRefundMethod: 'Select Refund Method',
    enterRefundReason: 'Enter Refund Reason',
    refund: 'Refund',
    refundReceipt: 'Refund Receipt',
    thankYou: 'Thank you for your business',
    refundId: 'Refund ID',
    invoiceIdLabel: 'Invoice ID:',
    customerLabel: 'Customer:',
    dateLabel: 'Date:',
    amountRefunded: 'Amount Refunded:',
    refundMethodLabel: 'Refund Method:',
    reasonLabel: 'Reason:',
    refundProcessed: 'Refund Processed',
    receiptSentToPrinter: 'Receipt sent to printer',
    processingPrintRequest: 'Processing print request',
    refundInformation: 'Refund Information',
    totalInvoiceAmount: 'Total Invoice Amount',
    selectReason: 'Select Reason',
    customerDissatisfied: 'Customer Dissatisfied',
    productDefect: 'Product Defect',
    incorrectPrescription: 'Incorrect Prescription',
    frameExchange: 'Frame Exchange',
    billingError: 'Billing Error',
    other: 'Other',
    staffNotes: 'Staff Notes',
    archive: 'Archive',
    deleteOrder: 'Delete Order',
    reasonForDeletion: 'Reason for Deletion',
    confirmDeletion: 'Confirm Deletion',
    orderDeletedSuccessfully: 'Order Deleted Successfully',
    orderDeletionFailed: 'Order Deletion Failed',
    workOrder: 'Work Order',
    workOrders: 'Work Orders',
    active: 'Active',
    completed: 'Completed',
    transactionHistory: 'Transaction History',
    transactions: 'Transactions',
    noActiveOrders: 'No active orders',
    noCompletedOrders: 'No completed orders',
    noRefundedTransactions: 'No refunded transactions',
    noArchivedOrders: 'No archived orders',
    printInvoice: 'Print Invoice',
    printWorkOrder: 'Print Work Order',
    markAsPickedUp: 'Mark as Picked Up',
    orderPickedUpSuccessfully: 'Order has been marked as picked up',
    anonymous: 'Anonymous',
    areYouSure: 'Are you sure?',
    thisActionCannotBeUndone: 'This action cannot be undone.',
    delete: 'Delete',
    deleted: 'Deleted',
    archived: 'Archived',
    refunded: 'Refunded',
    refundInfo: 'Refund Info',
    amount: 'Amount',
    dailySalesReport: 'Daily Sales Report',
    overviewOfSales: 'Overview of Sales',
    sales: 'Sales',
    payments: 'Payments',
    salesInfo: 'Sales Information',
    totalSales: 'Total Sales',
    patientName: 'Patient Name',
    paymentInfo: 'Payment Information',
    totalPayments: 'Total Payments',
    paymentDate: 'Payment Date',
    invoiceNumber: 'Invoice Number',
    workOrderNumber: 'Work Order Number',
    refundDate: 'Refund Date',
    refundsTab: 'Refunds',
    method: 'Method',
    kwd: 'KWD',
    currency: 'KWD',
    name: 'Name',
    phone: 'Phone',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    axisValidationError: 'If cylinder value is provided, axis value is required',
    contactLensPrescription: 'Contact Lens Prescription',
    noContactLensRx: 'No contact lens prescription has been added yet',
    rightEye: 'Right Eye',
    leftEye: 'Left Eye',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    error: 'Error',
    requiredField: 'This field is required',
    success: 'Success',
    successMessage: 'Operation completed successfully',
    createClientTitle: 'Create New Client',
    prescriptionGlasses: 'Prescription Glasses',
    contactLensesTab: 'Contact Lenses',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    day: 'Day',
    month: 'Month',
    year: 'Year',
    clientDidntShareDOB: 'Client did not share date of birth',
    notesPlaceholder: 'Add notes about the client here...',
    glassesPrescription: 'Glasses Prescription',
    prescriptionDate: 'Prescription Date',
    choosePrescriptionDate: 'Choose a prescription date',
    choose: 'Choose',
    saveAndContinue: 'Save and Continue',
    invoiceTitle: 'Create Invoice',
    clientSection: 'Client',
    productSection: 'Products',
    paymentSection: 'Payment',
    summarySection: 'Summary',
    next: 'Next',
    previous: 'Previous',
    invoiceSummary: 'Invoice Summary',
    clientInformation: 'Client Information',
    waitingForClientData: 'Waiting for client data',
    thickness: 'Thickness',
    quantity: 'Quantity',
    waitingForProductData: 'Waiting for product data',
    subtotal: 'Subtotal',
    paidInFull: 'Paid in Full',
    waitingForPaymentData: 'Waiting for payment data',
    print: 'Print',
    close: 'Close',
    printing: 'Printing...',
    workOrderPreview: 'Work Order Preview',
    previewBeforePrinting: 'Preview before printing',
    startBySelectingClient: 'Start by selecting a client',
    customer: 'Customer',
    welcome: 'Welcome',
    systemDescription: 'Optical shop management system',
    reportsPage: 'Reports Page',
    currentTime: 'Current Time',
    eye: 'Eye',
    rightEyeAbbr: 'OD',
    leftEyeAbbr: 'OS',
    color: 'Color',
    size: 'Size',
    edit: 'Edit',
    copy: 'Copy',
    noFramesMatchingSearch: 'No frames matching your search',
    pleaseEnterCompleteFrameDetails: 'Please enter complete frame details',
    pleaseEnterValidPrice: 'Please enter a valid price',
    pleaseEnterValidQuantity: 'Please enter a valid quantity',
    searchForFrame: 'Search for frame',
    printLabels: 'Print Labels',
    addNewFrame: 'Add New Frame',
    addNewFrameTitle: 'Add New Frame',
    addNewFrameDescription: 'Enter frame details below',
    brand: 'Brand',
    brandExample: 'e.g., Ray-Ban, Oakley',
    model: 'Model',
    modelExample: 'e.g., Wayfarer, Aviator',
    colorExample: 'e.g., Black, Tortoise',
    sizeExample: 'e.g., 52-18-140',
    price: 'Price',
    saveFrame: 'Save Frame',
    noFramesFound: 'No frames found',
    showAllFrames: 'Show All Frames',
    printFrameLabels: 'Print Frame Labels',
    selectFramesForLabels: 'Select frames for labels',
    frameNotFound: 'Frame not found',
    labelPrintedSuccessfully: 'Label printed successfully',
    errorGeneratingQRCode: 'Error generating QR code',
    noFramesSelected: 'No frames selected',
    labelsPrintedSuccessfully: 'Labels printed successfully',
    errorGeneratingQRCodes: 'Error generating QR codes',
    selectedFrames: 'Selected Frames',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    printSelected: 'Print Selected',
    selectFramesToPrint: 'Select frames to print',
    labelPreview: 'Label Preview',
    noFramesAvailable: 'No frames available',
    frames: 'Frames',
    contactLenses: 'Contact Lenses',
    lensTypes: 'Lens Types',
    lensCoatings: 'Lens Coatings',
    lensThicknesses: 'Lens Thicknesses',
    frameManagement: 'Frame Management',
    contactLensManagement: 'Contact Lens Management',
    dashboard: 'Dashboard',
    createClient: 'Create Client',
    createInvoice: 'Create Invoice',
    inventory: 'Inventory',
    remainingPayments: 'Remaining Payments',
    patientSearch: 'Patient Search',
    fillRequiredFields: 'Please fill all required fields',
    coatingAddedSuccess: 'Coating added successfully',
    coatingUpdatedSuccess: 'Coating updated successfully',
    coatingDeletedSuccess: 'Coating deleted successfully',
    distanceReading: 'Distance Reading',
    progressive: 'Progressive',
    bifocal: 'Bifocal',
    addCoating: 'Add Coating',
    addNewCoatingTitle: 'Add New Coating',
    addNewCoatingDescription: 'Enter coating details below',
    coatingName: 'Coating Name',
    coatingNameExample: 'e.g., Anti-Glare, Blue Light',
    coatingDescription: 'Coating Description',
    category: 'Category',
    chooseCategory: 'Choose a category',
    save: 'Save',
    noCoatings: 'No coatings found',
    editCoating: 'Edit Coating',
    updateCoatingDetails: 'Update coating details',
    skipLens: 'Skip Lens',
    selectLensType: 'Select Lens Type',
    selectCoatings: 'Select Coatings',
    selectThickness: 'Select Thickness',
    noCoating: 'No Coating',
    noCoatingDesc: 'No coating selected',
    selectLensTypeFirst: 'Select lens type first',
    noThickness: 'No Thickness',
    noThicknessDesc: 'No thickness selected',
    lensSkipped: 'Lens Skipped',
    addLens: 'Add Lens',
    thicknessAddedSuccess: 'Thickness added successfully',
    thicknessUpdatedSuccess: 'Thickness updated successfully',
    thicknessDeletedSuccess: 'Thickness deleted successfully',
    thicknessName: 'Thickness Name',
    thicknessNameExample: 'e.g., Ultra Thin, Standard',
    thicknessDescription: 'Thickness Description',
    noThicknessesInCategory: 'No thicknesses found in this category',
    addThickness: 'Add Thickness',
    editThickness: 'Edit Thickness',
    updateThicknessDetails: 'Update thickness details',
    lensAddedSuccess: 'Lens added successfully',
    lensUpdatedSuccess: 'Lens updated successfully',
    lensDeletedSuccess: 'Lens deleted successfully',
    distance: 'Distance',
    reading: 'Reading',
    sunglasses: 'Sunglasses',
    addNewLensTitle: 'Add New Lens',
    addNewLensDescription: 'Enter lens details below',
    lensName: 'Lens Name',
    lensNameExample: 'e.g., Premium Single Vision',
    type: 'Type',
    chooseType: 'Choose a type',
    noLensesInCategory: 'No lenses found in this category',
    editLensType: 'Edit Lens Type',
    updateLensDetails: 'Update lens details',
    noteEmpty: 'Note cannot be empty',
    noteAdded: 'Note added successfully',
    noteDeleted: 'Note deleted successfully',
    noteUpdated: 'Note updated successfully',
    patientNotes: 'Patient Notes',
    noNotesYet: 'No notes yet',
    addNoteBelow: 'Add a note below',
    addNoteHere: 'Add note here...',
    addNote: 'Add Note',
    dataError: 'Data Error',
    fillAllRequiredFields: 'Please fill all required fields',
    noteCannotBeEmpty: 'Note cannot be empty',
    noteAddedSuccessfully: 'Note added successfully',
    rxAndCareInstructions: 'Rx and Care Instructions',
    printPrescription: 'Print Prescription',
    newRx: 'New Rx',
    currentRx: 'Current Rx',
    addNewNote: 'Add New Note',
    enterNoteAboutPatient: 'Enter a note about the patient',
    noNotes: 'No notes',
    addNotesToTrackInfo: 'Add notes to track patient information',
    rxHistory: 'Rx History',
    pupillaryDistance: 'Pupillary Distance',
    actions: 'Actions',
    right: 'Right',
    left: 'Left',
    view: 'View',
    noPreviousRx: 'No Previous Rx',
    noPreviousRxDescription: 'No previous prescriptions found',
    glassesCareTips: 'Glasses Care Tips',
    tip1: 'Clean lenses with a microfiber cloth',
    tip2: 'Use both hands when putting on glasses',
    tip3: 'Store glasses in a case when not in use',
    tip4: 'Avoid placing glasses face down on surfaces',
    addNewRx: 'Add New Rx',
    addNewRxFor: 'Add New Rx for',
    viewPrescription: 'View Prescription',
    searchClient: 'Search Client',
    searchResults: 'Search Results',
    age: 'Age',
    pendingOrders: 'Pending Orders',
    completedOrders: 'Completed Orders',
    noPendingOrders: 'No pending orders',
    notPickedUp: 'Not Picked Up',
    lens: 'Lens',
    edited: 'Edited',
    printPreview: 'Print Preview',
    invoiceSaved: 'Invoice Saved',
    errorSavingInvoice: 'Error saving invoice',
    saving: 'Saving...',
    glassesDetails: 'Glasses Details',
    contactLensDetails: 'Contact Lens Details',
    item: 'Item',
    noProductDetails: 'No product details',
    duePayments: 'Due Payments',
    selectLanguageForPrinting: 'Select language for printing',
    workOrderUpdated: 'Work order updated successfully',
    errorUpdatingWorkOrder: 'Error updating work order',
    editWorkOrder: 'Edit Work Order',
    selectFrameBrand: 'Select Frame Brand',
    selectFrameModel: 'Select Frame Model',
    selectFrameColor: 'Select Frame Color',
    selectLensType: 'Select Lens Type',
    selectCoating: 'Select Coating',
    patientId: 'Patient ID',
    patientInformation: 'Patient Information',
    frameDetails: 'Frame Details',
    prescriptionDetails: 'Prescription Details',
    lensDetails: 'Lens Details',
    thicknessPrice: 'Thickness Price',
    technicianSignature: 'Technician Signature',
    qualityConfirmation: 'Quality Confirmation',
    orderNumber: 'Order Number',
    printingCompleted: 'Printing Completed',
    printingFailed: 'Printing Failed',
    selectPrintFormat: 'Select Print Format',
    choosePrintFormatDescription: 'Choose the format for printing',
    paper: 'Paper',
    standardFormat: 'Standard Format',
    receiptFormat: 'Receipt Format',
    compactFormat: 'Compact Format',
    notSpecified: 'Not Specified',
    phoneSearchError: 'Please enter a phone number to search',
    noClientsFound: 'No clients found',
    noClientFile: 'No Client File',
    phoneColon: 'Phone:',
    typeToSearch: 'Type to search',
    clientName: 'Client Name',
    clientPhone: 'Client Phone',
    patientID: 'Patient ID',
    hideRx: 'Hide Rx',
    showRx: 'Show Rx',
    optional: 'Optional',
    paymentMethodError: 'Please select a payment method',
    orderSavedSuccess: 'Order saved successfully',
    discountSection: 'Discount Section',
    discountColon: 'Discount:',
    depositColon: 'Deposit:',
    payInFull: 'Pay in Full',
    visa: 'Visa',
    mastercard: 'MasterCard',
    approvalNumber: 'Approval Number',
    totalInvoice: 'Total Invoice',
    searchTermError: 'Please enter a search term',
    frameDetailsError: 'Please enter frame details',
    priceError: 'Please enter a valid price',
    quantityError: 'Please enter a valid quantity',
    frameAddedSuccess: 'Frame added successfully',
    contactLensesTotal: 'Contact Lenses Total',
    lensCount: 'Lens Count',
    lensSection: 'Lens Section',
    frameSection: 'Frame Section',
    searchTerm: 'Search Term',
    searchExample: 'e.g., Ray-Ban, Oakley',
    selectedFrame: 'Selected Frame',
    addFrameButton: 'Add Frame',
    newFrameDetails: 'New Frame Details',
    pieces: 'pieces',
    invoiceCreated: 'Invoice Created',
    invoiceSuccessMessage: 'Your invoice has been created successfully',
    orderType: 'Order Type',
    partiallyPaid: 'Partially Paid',
    nextSteps: 'Next Steps',
    printWorkOrderDescription: 'Print the work order for production',
    printInvoiceDescription: 'Print a copy of the invoice for the customer',
    refundMethod: 'Refund Method',
    refundId: 'Refund ID',
    goToClientSection: 'Go to Client Section',
    refreshPrintPage: 'Refresh Print Page',
  },
  ar: {
    invoice: 'فاتورة',
    patient: 'مريض',
    date: 'تاريخ',
    totalAmount: 'المبلغ الإجمالي',
    paymentMethod: 'طريقة الدفع',
    paymentStatus: 'حالة الدفع',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    invoiceId: 'رقم الفاتورة',
    customerName: 'اسم العميل',
    customerPhone: 'رقم هاتف العميل',
    amountPaid: 'المبلغ المدفوع',
    remainingAmount: 'المبلغ المتبقي',
    makePayment: 'إجراء الدفع',
    selectPaymentMethod: 'اختر طريقة الدفع',
    cash: 'نقداً',
    knet: 'كي نت',
    creditCard: 'بطاقة ائتمان',
    paymentSuccessful: 'تم الدفع بنجاح',
    paymentFailed: 'فشل الدفع',
    printReceipt: 'طباعة الإيصال',
    enterAmount: 'أدخل المبلغ',
    enterAuthNumber: 'أدخل رقم التفويض',
    authNumber: 'رقم التفويض',
    depositReceived: 'تم استلام الإيداع',
    addPayment: 'إضافة دفعة',
    editInvoice: 'تعديل الفاتورة',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    invoiceDetails: 'تفاصيل الفاتورة',
    workOrderDetails: 'تفاصيل أمر العمل',
    additionalNotes: 'ملاحظات إضافية',
    contactLens: 'عدسة لاصقة',
    lensType: 'نوع العدسة',
    lensPrice: 'سعر العدسة',
    frame: 'إطار',
    frameBrand: 'ماركة الإطار',
    frameModel: 'موديل الإطار',
    frameColor: 'لون الإطار',
    frameSize: 'حجم الإطار',
    framePrice: 'سعر الإطار',
    coating: 'طلاء',
    coatingPrice: 'سعر الطلاء',
    discount: 'خصم',
    total: 'المجموع',
    deposit: 'إيداع',
    remaining: 'المتبقي',
    payment: 'دفع',
    createdAt: 'أنشئت في',
    isPaid: 'تم الدفع',
    isPickedUp: 'تم الاستلام',
    pickedUpAt: 'تم الاستلام في',
    lastEditedAt: 'آخر تعديل في',
    editHistory: 'سجل التعديلات',
    timestamp: 'الطابع الزمني',
    notes: 'ملاحظات',
    glasses: 'نظارات',
    contacts: 'عدسات',
    search: 'بحث',
    noResults: 'لا يوجد نتائج',
    select: 'اختر',
    refundAmount: 'مبلغ الاسترداد',
    refundMethod: 'طريقة الاسترداد',
    refundReason: 'سبب الاسترداد',
    additionalNotesForRefund: 'ملاحظات إضافية للاسترداد',
    processRefund: 'معالجة الاسترداد',
    refundProcessedSuccessfully: 'تمت معالجة الاسترداد بنجاح',
    errorProcessingRefund: 'خطأ في معالجة الاسترداد',
    missingData: 'بيانات مفقودة',
    selectRefundMethod: 'اختر طريقة الاسترداد',
    enterRefundReason: 'أدخل سبب الاسترداد',
    refund: 'استرداد',
    refundReceipt: 'إيصال استرداد',
    thankYou: 'شكراً لتعاملكم معنا',
    refundId: 'رقم الاسترداد',
    invoiceIdLabel: 'رقم الفاتورة:',
    customerLabel: 'العميل:',
    dateLabel: 'التاريخ:',
    amountRefunded: 'المبلغ المسترد:',
    refundMethodLabel: 'طريقة الاسترداد:',
    reasonLabel: 'السبب:',
    refundProcessed: 'تم استرداد المبلغ',
    receiptSentToPrinter: 'تم إرسال الإيصال إلى الطابعة',
    processingPrintRequest: 'جاري معالجة طلب الطباعة',
    refundInformation: 'معلومات الاسترداد',
    totalInvoiceAmount: 'إجمالي مبلغ الفاتورة',
    selectReason: 'اختر السبب',
    customerDissatisfied: 'العميل غير راضٍ',
    productDefect: 'عيب في المنتج',
    incorrectPrescription: 'وصفة طبية غير صحيحة',
    frameExchange: 'استبدال الإطار',
    billingError: 'خطأ في الفواتير',
    other: 'آخر',
    staffNotes: 'ملاحظات الموظفين',
    archive: 'أرشيف',
    deleteOrder: 'حذف الطلب',
    reasonForDeletion: 'سبب الحذف',
    confirmDeletion: 'تأكيد الحذف',
    orderDeletedSuccessfully: 'تم حذف الطلب بنجاح',
    orderDeletionFailed: 'فشل حذف الطلب',
    workOrder: 'أمر عمل',
    workOrders: 'أوامر العمل',
    active: 'نشط',
    completed: 'مكتمل',
    transactionHistory: 'سجل المعاملات',
    transactions: 'المعاملات',
    noActiveOrders: 'لا توجد طلبات نشطة',
    noCompletedOrders: 'لا توجد طلبات مكتملة',
    noRefundedTransactions: 'لا توجد مبالغ مستردة',
    noArchivedOrders: 'لا توجد طلبات مؤرشفة',
    printInvoice: 'طباعة الفاتورة',
    printWorkOrder: 'طباعة أمر العمل',
    markAsPickedUp: 'تأكيد الاستلام',
    orderPickedUpSuccessfully: 'تم تأكيد استلام الطلب بنجاح',
    anonymous: 'مجهول',
    areYouSure: 'هل أنت متأكد؟',
    thisActionCannotBeUndone: 'لا يمكن التراجع عن هذا الإجراء.',
    delete: 'حذف',
    deleted: 'تم الحذف',
    archived: 'مؤرشف',
    refunded: 'مسترد',
    refundInfo: 'معلومات الاسترداد',
    amount: 'المبلغ',
    dailySalesReport: 'تقرير المبيعات اليومية',
    overviewOfSales: 'نظرة عامة على المبيعات',
    sales: 'المبيعات',
    payments: 'المدفوعات',
    salesInfo: 'معلومات المبيعات',
    totalSales: 'إجمالي المبيعات',
    patientName: 'اسم المريض',
    paymentInfo: 'معلومات الدفع',
    totalPayments: 'إجمالي المدفوعات',
    paymentDate: 'تاريخ الدفع',
    invoiceNumber: 'رقم الفاتورة',
    workOrderNumber: 'رقم أمر العمل',
    refundDate: 'تاريخ الاسترداد',
    refundsTab: 'المبالغ المستردة',
    method: 'الطريقة',
    kwd: 'د.ك',
    currency: 'د.ك',
    name: 'الاسم',
    phone: 'الهاتف',
    phoneNumber: 'رقم الهاتف',
    dateOfBirth: 'تاريخ الميلاد',
    axisValidationError: 'إذا تم توفير قيمة الأسطوانة، فإن قيمة المحور مطلوبة',
    contactLensPrescription: 'وصفة العدسات اللاصقة',
    noContactLensRx: 'لم تتم إضافة وصفة للعدسات اللاصقة بعد',
    rightEye: 'العين اليمنى',
    leftEye: 'العين اليسرى',
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    july: 'يوليو',
    august: 'أغسطس',
    september: 'سبتمبر',
    october: 'أكتوبر',
    november: 'نوفمبر',
    december: 'ديسمبر',
    error: 'خطأ',
    requiredField: 'هذا الحقل مطلوب',
    success: 'نجاح',
    successMessage: 'تمت العملية بنجاح',
    createClientTitle: 'إنشاء عميل جديد',
    prescriptionGlasses: 'نظارات طبية',
    contactLensesTab: 'عدسات لاصقة',
    personalInfo: 'معلومات شخصية',
    fullName: 'الاسم الكامل',
    day: 'اليوم',
    month: 'الشهر',
    year: 'السنة',
    clientDidntShareDOB: 'لم يشارك العميل تاريخ الميلاد',
    notesPlaceholder: 'أضف ملاحظات حول العميل هنا...',
    glassesPrescription: 'وصفة النظارات',
    prescriptionDate: 'تاريخ الوصفة',
    choosePrescriptionDate: 'اختر تاريخ الوصفة',
    choose: 'اختر',
    saveAndContinue: 'حفظ ومتابعة',
    invoiceTitle: 'إنشاء فاتورة',
    clientSection: 'العميل',
    productSection: 'المنتجات',
    paymentSection: 'الدفع',
    summarySection: 'الملخص',
    next: 'التالي',
    previous: 'السابق',
    invoiceSummary: 'ملخص الفاتورة',
    clientInformation: 'معلومات العميل',
    waitingForClientData: 'في انتظار بيانات العميل',
    thickness: 'السمك',
    quantity: 'الكمية',
    waitingForProductData: 'في انتظار بيانات المنتج',
    subtotal: 'المجموع الفرعي',
    paidInFull: 'مدفوع بالكامل',
    waitingForPaymentData: 'في انتظار بيانات الدفع',
    print: 'طباعة',
    close: 'إغلاق',
    printing: 'جاري الطباعة...',
    workOrderPreview: 'معاينة أمر العمل',
    previewBeforePrinting: 'معاينة قبل الطباعة',
    startBySelectingClient: 'ابدأ باختيار عميل',
    customer: 'العميل',
    welcome: 'مرحبًا',
    systemDescription: 'نظام إدارة محل النظارات',
    reportsPage: 'صفحة التقارير',
    currentTime: 'الوقت الحالي',
    eye: 'العين',
    rightEyeAbbr: 'يمنى',
    leftEyeAbbr: 'يسرى',
    color: 'اللون',
    size: 'الحجم',
    edit: 'تعديل',
    copy: 'نسخ',
    noFramesMatchingSearch: 'لا توجد إطارات مطابقة للبحث',
    pleaseEnterCompleteFrameDetails: 'الرجاء إدخال تفاصيل الإطار كاملة',
    pleaseEnterValidPrice: 'الرجاء إدخال سعر صحيح',
    pleaseEnterValidQuantity: 'الرجاء إدخال كمية صحيحة',
    searchForFrame: 'البحث عن إطار',
    printLabels: 'طباعة الملصقات',
    addNewFrame: 'إضافة إطار جديد',
    addNewFrameTitle: 'إضافة إطار جديد',
    addNewFrameDescription: 'أدخل تفاصيل الإطار أدناه',
    brand: 'الماركة',
    brandExample: 'مثال: راي بان، أوكلي',
    model: 'الموديل',
    modelExample: 'مثال: ويفرير، أفياتور',
    colorExample: 'مثال: أسود، كهرماني',
    sizeExample: 'مثال: 52-18-140',
    price: 'السعر',
    saveFrame: 'حفظ الإطار',
    noFramesFound: 'لم يتم العثور على إطارات',
    showAllFrames: 'عرض جميع الإطارات',
    printFrameLabels: 'طباعة ملصقات الإطارات',
    selectFramesForLabels: 'اختر الإطارات للملصقات',
    frameNotFound: 'لم يتم العثور على الإطار',
    labelPrintedSuccessfully: 'تمت طباعة الملصق بنجاح',
    errorGeneratingQRCode: 'خطأ في إنشاء رمز الاستجابة السريعة',
    noFramesSelected: 'لم يتم اختيار إطارات',
    labelsPrintedSuccessfully: 'تمت طباعة الملصقات بنجاح',
    errorGeneratingQRCodes: 'خطأ في إنشاء رموز الاستجابة السريعة',
    selectedFrames: 'الإطارات المختارة',
    selectAll: 'اختيار الكل',
    deselectAll: 'إلغاء اختيار الكل',
    printSelected: 'طباعة المحدد',
    selectFramesToPrint: 'اختر الإطارات للطباعة',
    labelPreview: 'معاينة الملصق',
    noFramesAvailable: 'لا توجد إطارات متاحة',
    frames: 'الإطارات',
    contactLenses: 'عدسات لاصقة',
    lensTypes: 'أنواع العدسات',
    lensCoatings: 'طلاءات العدسات',
    lensThicknesses: 'سماكات العدسات',
    frameManagement: 'إدارة الإطارات',
    contactLensManagement: 'إدارة العدسات اللاصقة',
    dashboard: 'لوحة التحكم',
    createClient: 'إنشاء عميل',
    createInvoice: 'إنشاء فاتورة',
    inventory: 'المخزون',
    remainingPayments: 'المدفوعات المتبقية',
    patientSearch: 'بحث عن مريض',
    fillRequiredFields: 'الرجاء ملء جميع الحقول المطلوبة',
    coatingAddedSuccess: 'تمت إضافة الطلاء بنجاح',
    coatingUpdatedSuccess: 'تم تحديث الطلاء بنجاح',
    coatingDeletedSuccess: 'تم حذف الطلاء بنجاح',
    distanceReading: 'قراءة المسافة',
    progressive: 'تدريجي',
    bifocal: 'ثنائي البؤرة',
    addCoating: 'إضافة طلاء',
    addNewCoatingTitle: 'إضافة طلاء جديد',
    addNewCoatingDescription: 'أدخل تفاصيل الطلاء أدناه',
    coatingName: 'اسم الطلاء',
    coatingNameExample: 'مثال: مضاد للوهج، ضوء أزرق',
    coatingDescription: 'وصف الطلاء',
    category: 'الفئة',
    chooseCategory: 'اختر فئة',
    save: 'حفظ',
    noCoatings: 'لم يتم العثور على طلاءات',
    editCoating: 'تعديل الطلاء',
    updateCoatingDetails: 'تحديث تفاصيل الطلاء',
    skipLens: 'تخطي العدسة',
    selectLensType: 'اختر نوع العدسة',
    selectCoatings: 'اختر الطلاءات',
    selectThickness: 'اختر السماكة',
    noCoating: 'بدون طلاء',
    noCoatingDesc: 'لم يتم اختيار طلاء',
    selectLensTypeFirst: 'اختر نوع العدسة أولاً',
    noThickness: 'بدون سماكة',
    noThicknessDesc: 'لم يتم اختيار سماكة',
    lensSkipped: 'تم تخطي العدسة',
    addLens: 'إضافة عدسة',
    thicknessAddedSuccess: 'تمت إضافة السماكة بنجاح',
    thicknessUpdatedSuccess: 'تم تحديث السماكة بنجاح',
    thicknessDeletedSuccess: 'تم حذف السماكة بنجاح',
    thicknessName: 'اسم السماكة',
    thicknessNameExample: 'مثال: رفيعة جداً، قياسية',
    thicknessDescription: 'وصف السماكة',
    noThicknessesInCategory: 'لم يتم العثور على سماكات في هذه الفئة',
    addThickness: 'إضافة سماكة',
    editThickness: 'تعديل السماكة',
    updateThicknessDetails: 'تحديث تفاصيل السماكة',
    lensAddedSuccess: 'تمت إضافة العدسة بنجاح',
    lensUpdatedSuccess: 'تم تحديث العدسة بنجاح',
    lensDeletedSuccess: 'تم حذف العدسة بنجاح',
    distance: 'مسافة',
    reading: 'قراءة',
    sunglasses: 'نظارات شمسية',
    addNewLensTitle: 'إضافة عدسة جديدة',
    addNewLensDescription: 'أدخل تفاصيل العدسة أدناه',
    lensName: 'اسم العدسة',
    lensNameExample: 'مثال: رؤية أحادية ممتازة',
    type: 'النوع',
    chooseType: 'اختر نوعًا',
    noLensesInCategory: 'لم يتم العثور على عدسات في هذه الفئة',
    editLensType: 'تعديل نوع العدسة',
    updateLensDetails: 'تحديث تفاصيل العدسة',
    noteEmpty: 'الملاحظة لا يمكن أن تكون فارغة',
    noteAdded: 'تمت إضافة الملاحظة بنجاح',
    noteDeleted: 'تم حذف الملاحظة بنجاح',
    noteUpdated: 'تم تحديث الملاحظة بنجاح',
    patientNotes: 'ملاحظات المريض',
    noNotesYet: 'لا توجد ملاحظات بعد',
    addNoteBelow: 'أضف ملاحظة أدناه',
    addNoteHere: 'أضف ملاحظة هنا...',
    addNote: 'إضافة ملاحظة',
    dataError: 'خطأ في البيانات',
    fillAllRequiredFields: 'الرجاء ملء جميع الحقول المطلوبة',
    noteCannotBeEmpty: 'الملاحظة لا يمكن أن تكون فارغة',
    noteAddedSuccessfully: 'تمت إضافة الملاحظة بنجاح',
    rxAndCareInstructions: 'الوصفة الطبية وتعليمات العناية',
    printPrescription: 'طباعة الوصفة الطبية',
    newRx: 'وصفة طبية جديدة',
    currentRx: 'الوصفة الطبية الحالية',
    addNewNote: 'إضافة ملاحظة جديدة',
    enterNoteAboutPatient: 'أدخل ملاحظة عن المريض',
    noNotes: 'لا توجد ملاحظات',
    addNotesToTrackInfo: 'أضف ملاحظات لتتبع معلومات المريض',
    rxHistory: 'سجل الوصفات الطبية',
    pupillaryDistance: 'المسافة البؤبوية',
    actions: 'الإجراءات',
    right: 'يمين',
    left: 'يسار',
    view: 'عرض',
    noPreviousRx: 'لا توجد وصفات طبية سابقة',
    noPreviousRxDescription: 'لم يتم العثور على وصفات طبية سابقة',
    glassesCareTips: 'نصائح العناية بالنظارات',
    tip1: 'نظف العدسات بقطعة قماش من الألياف الدقيقة',
    tip2: 'استخدم كلتا اليدين عند وضع النظارات',
    tip3: 'احفظ النظارات في علبة عندما لا تكون قيد الاستخدام',
    tip4: 'تجنب وضع النظارات على الأسطح ووجهها للأسفل',
    addNewRx: 'إضافة وصفة طبية جديدة',
    addNewRxFor: 'إضافة وصفة طبية جديدة لـ',
    viewPrescription: 'عرض الوصفة الطبية',
    searchClient: 'البحث عن عميل',
    searchResults: 'نتائج البحث',
    age: 'العمر',
    pendingOrders: 'الطلبات المعلقة',
    completedOrders: 'الطلبات المكتملة',
    noPendingOrders: 'لا توجد طلبات معلقة',
    notPickedUp: 'لم يتم الاستلام',
    lens: 'عدسة',
    edited: 'تم التعديل',
    printPreview: 'معاينة الطباعة',
    invoiceSaved: 'تم حفظ الفاتورة',
    errorSavingInvoice: 'خطأ في حفظ الفاتورة',
    saving: 'جاري الحفظ...',
    glassesDetails: 'تفاصيل النظارات',
    contactLensDetails: 'تفاصيل العدسات اللاصقة',
    item: 'العنصر',
    noProductDetails: 'لا توجد تفاصيل منتج',
    duePayments: 'المدفوعات المستحقة',
    selectLanguageForPrinting: 'اختر اللغة للطباعة',
    workOrderUpdated: 'تم تحديث أمر العمل بنجاح',
    errorUpdatingWorkOrder: 'خطأ في تحديث أمر العمل',
    editWorkOrder: 'تعديل أمر العمل',
    selectFrameBrand: 'اختر ماركة الإطار',
    selectFrameModel: 'اختر موديل الإطار',
    selectFrameColor: 'اختر لون الإطار',
    selectLensType: 'اختر نوع العدسة',
    selectCoating: 'اختر الطلاء',
    patientId: 'رقم المريض',
    patientInformation: 'معلومات المريض',
    frameDetails: 'تفاصيل الإطار',
    prescriptionDetails: 'تفاصيل الوصفة الطبية',
    lensDetails: 'تفاصيل العدسة',
    thicknessPrice: 'سعر السماكة',
    technicianSignature: 'توقيع الفني',
    qualityConfirmation: 'تأكيد الجودة',
    orderNumber: 'رقم الط��ب',
    printingCompleted: 'اكتملت الطباعة',
    printingFailed: 'فشلت الطباعة',
    selectPrintFormat: 'اختر تنسيق الطباعة',
    choosePrintFormatDescription: 'اختر تنسيق الطباعة',
    paper: 'ورق',
    standardFormat: 'التنسيق القياسي',
    receiptFormat: 'تنسيق الإيصال',
    compactFormat: 'تنسيق مدمج',
    notSpecified: 'غير محدد',
    phoneSearchError: 'الرجاء إدخال رقم هاتف للبحث',
    noClientsFound: 'لم يتم العثور على عملاء',
    noClientFile: 'لا يوجد ملف عميل',
    phoneColon: 'الهاتف:',
    typeToSearch: 'اكتب للبحث',
    clientName: 'اسم العميل',
    clientPhone: 'هاتف العميل',
    patientID: 'رقم المريض',
    hideRx: 'إخفاء الوصفة',
    showRx: 'عرض الوصفة',
    optional: 'اختياري',
    paymentMethodError: 'الرجاء اختيار طريقة الدفع',
    orderSavedSuccess: 'تم حفظ الطلب بنجاح',
    discountSection: 'قسم الخصم',
    discountColon: 'الخصم:',
    depositColon: 'الإيداع:',
    payInFull: 'دفع بالكامل',
    visa: 'فيزا',
    mastercard: 'ماستركارد',
    approvalNumber: 'رقم الموافقة',
    totalInvoice: 'إجمالي الفاتورة',
    searchTermError: 'الرجاء إدخال مصطلح البحث',
    frameDetailsError: 'الرجاء إدخال تفاصيل الإطار',
    priceError: 'الرجاء إدخال سعر صحيح',
    quantityError: 'الرجاء إدخال كمية صحيحة',
    frameAddedSuccess: 'تمت إضافة الإطار بنجاح',
    contactLensesTotal: 'إجمالي العدسات اللاصقة',
    lensCount: 'عدد العدسات',
    lensSection: 'قسم العدسات',
    frameSection: 'قسم الإطار',
    searchTerm: 'مصطلح البحث',
    searchExample: 'مثال: راي بان، أوكلي',
    selectedFrame: 'الإطار المحدد',
    addFrameButton: 'إضافة إطار',
    newFrameDetails: 'تفاصيل الإطار الجديد',
    pieces: 'قطع',
    invoiceCreated: 'تم إنشاء الفاتورة',
    invoiceSuccessMessage: 'تم إنشاء فاتورتك بنجاح',
    orderType: 'نوع الطلب',
    partiallyPaid: 'مدفوع جزئياً',
    nextSteps: 'الخطوات التالية',
    printWorkOrderDescription: 'طباعة أمر العمل للإنتاج',
    printInvoiceDescription: 'طباعة نسخة من الفاتورة للعميل',
    refundMethod: 'طريقة الاسترداد',
    refundId: 'رقم الاسترداد',
    goToClientSection: 'الذهاب إلى قسم العميل',
    refreshPrintPage: 'تحديث صفحة الطباعة',
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en' as 'en' | 'ar',
      t: (key) => translations[get().language][key] || key,
      toggleLanguage: () => {
        set((state) => {
          const newLanguage = state.language === 'en' ? 'ar' : 'en';
          return { language: newLanguage };
        });
      },
      setLanguage: (lang: 'en' | 'ar') => {
        set({ language: lang });
      },
    }),
    {
      name: 'language-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
