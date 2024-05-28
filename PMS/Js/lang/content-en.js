
//1000-1999 -- Mainnew and individual pages 
//2000-2999 -- Tstruct
//3000-2999 -- Iview
function LoadglLangauge(message) {// Custom messages 
    var lngMessage = "";
    message = parseInt(message);
    switch (message) {
        case 1000:// Mainnew and individual pages 
            lngMessage = "Internal server error. Please check your node server is running.";
            break;
        case 1001:
            lngMessage = "Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.";
            break;
        case 1002:
            lngMessage = "Please enter existing password.";
            break;
        case 1003:
            lngMessage = "Password length should be minimum  {0}  characters.";
            break;
        case 1004:
            lngMessage = "Existing password and New password should not be same.";
            break;
        case 1005:
            lngMessage = "New password and confirm password should match.";
            break;
        case 1006:
            lngMessage = "New Password cannot be left empty.";
            break;
        case 1007:
            lngMessage = "Confirm Password cannot be left empty.";
            break;
        case 1008:
            lngMessage = "Please select a project name.";
            break;
        case 1009:
            lngMessage = "Please select a language.";
            break;
        case 1010:
            lngMessage = "Please enter your username.";
            break;
        case 1011:
            lngMessage = "Please enter your password.";
            break;
        case 1012:
            lngMessage = "Please enter username.";
            break;
        case 1013:
            lngMessage = "Special characters are not allowed in username.";
            break;
        case 1014:
            lngMessage = "Invalid E-mail ID";
            break;
        case 1015:
            lngMessage = "Please enter your email.";
            break;
        case 1016:
            lngMessage = "Please select a valid project name.";
            break;
        case 1017:
            lngMessage = "Please select a valid language.";
            break;
        case 1018://Work flow
            lngMessage = "Cannot assign the tasks to the same user.";
            break;
        case 1019:
            lngMessage = "Please add condition properly in row {0}";
            break;
        case 1020:
            lngMessage = "Please select a User.";
            break;
        case 1021:
            lngMessage = "Cannot assign the tasks to the same user.";
            break;
        case 1022:
            lngMessage = "There was an error {0}";
            break;
        case 1023:
            lngMessage = "Document cannot be empty.";
            break;
        case 1024:
            lngMessage = "Please fill all the filter criteria.";
            break;
        case 1025:
            lngMessage = "Subtype cannot be empty.";
            break;
        case 1026:
            lngMessage = "Cannot assign the tasks to the same user.";
            break;
        case 1027:// Widget Builder
            lngMessage = "Please select tstruct.";
            break;
        case 1030:
            lngMessage = "Please select unique column names.";
            break;
        case 1031:
            lngMessage = "There was an error please try again.";
            break;
        case 1032:
            lngMessage = "There was an error attempting to upload the file.";
            break;
        case 1033:
            lngMessage = "The upload has been canceled the browser due to dropped the connection.";
            break;
        case 1034:
            lngMessage = "Sorry, this is an invalid draft.";
            break;
        case 1035:
            lngMessage = "Please enter project name.";
            break;
        case 1036:
            lngMessage = "Please enter client connection name.";
            break;
        case 1037:
            lngMessage = "Please enter database username.";
            break;
        case 1038:
            lngMessage = "Configurations saved successfully.";
            break;
        case 1039:
            lngMessage = "Please enter a valid number. Value should be greater than 0.";
            break;
        case 1040:
            lngMessage = "Please enter a valid number. Value should be between 1 to 100.";
            break;
        case 1041:// Builder
            lngMessage = "Please select atleast one role";
            break;
        case 1042:
            lngMessage = "Home Is Full.";
            break;
        case 1043:
            lngMessage = "Please select a target {0}.";
            break;
        case 1044:
            lngMessage = "Please enter a valid url";
            break;
        case 1045:
            lngMessage = "Please save before publishing.";
            break;
        case 1046:
            lngMessage = "No modification have been made.";
            break;
        case 1047:
            lngMessage = "Invalid hyperlinks.";
            break;
        case 1048:
            lngMessage = "Invalid file format.";
            break;
        case 1049:
            lngMessage = "Please selct an image of size less than 2Mb.";
            break;
        case 1050:
            lngMessage = "File uploaded successfully!";
            break;
        case 1051:
            lngMessage = "Require at least one filter value";
            break;
        case 1052:
            lngMessage = "Name already exist";
            break;
        case 1053:
            lngMessage = "Please fill in all the required fields";
            break;
        case 1054:
            lngMessage = "Quicklink added successfully";
            break;
        case 1055:
            lngMessage = "Please select Role.";
            break;
        case 1056:
            lngMessage = "Error Found!";
            break;
        case 1057:
            lngMessage = "Widget Created";
            break;
        case 1058:
            lngMessage = "Updated Successfully";
            break;
        case 1059:
            lngMessage = "Require at least one filter value";
            break;

        case 2000:// Tstruct 
            lngMessage = "Waiting for previous request to be completed.";
            break;
        case 2001:
            lngMessage = "Cannot save, due to data loss.";
            break;
        case 2002:
            lngMessage = "Pdf not available for new record";
            break;
        case 2003:
            lngMessage = "Pdf not defined";
            break;
        case 2004:
            lngMessage = "Grid is Empty.";
            break;
        case 2005:
            lngMessage = "Please select atleast one group.";
            break;
        case 2006:
            lngMessage = "Popgrid details not applicable.";
            break;
        case 2007:
            lngMessage = "please enter search text";
            break
        case 2008:
            lngMessage = "This transaction cannot be deleted.";
            break;
        case 2009:
            lngMessage = "New Record";
            break;
        case 2010:
            lngMessage = "Cancelled record cannot be deleted.";
            break;
        case 2011:
            lngMessage = "No data to Delete";
            break;
        case 2012:
            lngMessage = "Record Deleted";
            break;
        case 2013:
            lngMessage = "Please select a document to print.";
            break;
        case 2014:
            lngMessage = "Cancel transaction is not allowed.";
            break;
        case 2015:
            lngMessage = "No data to Cancel";
            break;
        case 2016:
            lngMessage = "Please enter remarks.";
            break;
        case 2017:
            lngMessage = "Record Cancelled";
            break;
        case 2018:
            lngMessage = "No task defined.";
            break;
        case 2019:
            lngMessage = "Navigation is not available for this record.";
            break;
        case 2020:
            lngMessage = "Please enter expression value to upload field";
            break;
        case 2021:
            lngMessage = "Data is empty, please load the record!";
            break;
        case 2022:
            lngMessage = "PDF file not generated, please try again";
            break;
        case 2023:
            lngMessage = "Waiting for previous request to be completed.";
            break;
        case 2024:
            lngMessage = "This transaction is already cancelled.";
            break;
        case 2025:
            lngMessage = "Cancel transaction is not allowed.";
            break;
        case 2026:
            lngMessage = "Done";
            break;
        case 2027:
            lngMessage = "The file already exists.";
            break;
        case 2028:
            lngMessage = "The transaction is exported as HTML. \n" + "Location: Server \n Path: {0}";
            break;
        case 2029:
            lngMessage = "Error: {0}";
            break;
        case 2030:
            lngMessage = "Error: Name: {0} Message: {1}";
            break;
        case 2031:
            lngMessage = "{0} Field should not have decimal value greater than defined decimal value";
            break;
        case 2032:
            lngMessage = "Row Saved";
            break;
        case 2033:
            lngMessage = "Error: Your string doesnot have the character";
            break;
        case 2034:
            lngMessage = "Invalid Number";
            break;
        case 2035:
            lngMessage = "Please Enter A Number.";
            break;
        case 2036:
            lngMessage = "wrong Number";
            break;
        case 2037:
            lngMessage = "Oops!!!! the Number is too big";
            break;
        case 2038:
            lngMessage = "empty";
            break;
        case 2039:
            lngMessage = "Please provide a valid email address";
            break;
        case 2040:
            lngMessage = "The date format should be : " + (typeof dateString != "undefined" ? dateString : "dd/mm/yyyy");
            break;
        case 2041:
            lngMessage = "Please enter a valid month";
            break;
        case 2042:
            lngMessage = "Please enter a valid day";
            break;
        case 2043:
            lngMessage = "Please enter a valid 4 digit year";
            break;
        case 2044:
            lngMessage = "Please enter a valid date";
            break;
        case 2045:
            lngMessage = "Select 3!!!!!!!!!!";
            break;
        case 2046:
            lngMessage = "You Can't Select Grid and Non Grid at time";
            break;
        case 2047:
            lngMessage = "please select Fields in sequence order";
            break;
        case 2048:
            lngMessage = "Select 2 Fields Or 3 Fields";
            break;
        case 2049:
            lngMessage = "Select 1!!!!!!!!!!";
            break;
        case 2050:
            lngMessage = "Please select an element";
            break;
        case 2051:
            lngMessage = "This transaction is {0}";
            break;
        case 2052:
            lngMessage = "{0} cannot be Negative. ";
            break;
        case 2053:
            lngMessage = "Invalid {0} \ {1} \ is a reserved word.";
            break;
        case 2054:
            lngMessage = "{0} is empty. Please enter data.";
            break;
        case 2055:
            lngMessage = "{0} cannot be empty.";
            break;
        case 2056:
            lngMessage = "{0} cannot be empty. Rowno :{1}";
            break;
        case 2057:
            lngMessage = "No PDF Structure is Defined";
            break;
        case 2058:
            lngMessage = "Draft Saved";
            break;
        case 2059:
            lngMessage = "Couldn't Save Draft";
            break;
        case 2060:
            lngMessage = "Failed to Save Draft";
            break;


        case 3000:// Iview 
            lngMessage = "RecordId Is Empty";
            break;
        case 3001:
            lngMessage = "No Rows Selected";
            break;
        case 3002:
            lngMessage = "Select One Row Only";
            break;
        case 3003:
            lngMessage = "Invalid data from server.";
            break;
        case 3004:
            lngMessage = "New entries are updated..!!";
            break;
        case 3005:
            lngMessage = "Server request timed out.";
            break;
        case 3006:
            lngMessage = "Number of rows Exceeds limit to save records.";
            break;
        case 3007:
            lngMessage = "No data found.";
            break;
        case 3008:
            lngMessage = "Record details not found.";
            break;
        case 3009:
            lngMessage = "Cancelled record cannot be deleted.";
            break;
        case 3010:
            lngMessage = "Record Deleted";
            break;
        case 3011:
            lngMessage = "{0} cannot be left empty.";
            break;
        case 3012:
            lngMessage = "The date format should be : " + (typeof dateString != "undefined" ? dateString : "dd/mm/yyyy");
            break;
        case 2013:
            lngMessage = "Please enter a valid month";
            break;
        case 3014:
            lngMessage = "Please enter a valid day";
            break;
        case 3015:
            lngMessage = "Please enter a valid 4 digit year between {0} and {1}";
            break;
        case 3016:
            lngMessage = "Please enter a valid date";
            break;
        case 3017:
            lngMessage = "the browser don't support";
            break;
        case 3018:
            lngMessage = "Fields of Grid DC is already chosen.Another Grid DC cannot be chosen.";
            break;
        case 3019:
            lngMessage = "Please enter view name.";
            break;
        case 3020:
            lngMessage = "View name cannot be more than 15 characters";
            break;
        case 3021:
            lngMessage = "Please select column.";
            break;
        case 3022:
            lngMessage = "View name already exist";
            break;
        case 3023:
            lngMessage = "View name cannot be more than 15 characters";
            break;
        case 3024:
            lngMessage = "View name already created by some other user";
            break;
        case 3025:
            lngMessage = "Enter minimum of one parameter with Date Of Birth";
            break;
        case 3026:
            lngMessage = "Enter atleast one more parameter";
            break;
        case 3027:
            lngMessage = "Chart not available as no internet connectivity.";
            break;
        case 3028:
            lngMessage = "Failure during the process.";
            break;
        case 3029:
            lngMessage = "Select a file.";
            break;
        case 3030:
            lngMessage = "View saved successfully!";
            break;
        case 3031:// PDF params
            lngMessage = "No PDF Structure is Defined";
            break;
        case 3032:
            lngMessage = "Please select all required fields..";//"Please select all required dropdown values to continue...";
            break;
        case 3033:
            lngMessage = "View deleted successfully!";
            break;

        case 4000:// Server side messages 
            lngMessage = "Please enter the search criteria.";
            break;
        case 4001:
            lngMessage = "Please select the project name.";
            break;
        case 4002:
            lngMessage = "Missing Oracle Client!!! Please install Oracle Client from {0}";
            break;
        case 4003:
            lngMessage = "Oracle Home: missing info in registry {0}";
            break;
        case 4004:
            lngMessage = "{0} has been updated successfully.";
            break;
        case 4005:
            lngMessage = "Please enter project name.";
            break;
        case 4006:
            lngMessage = "Please enter client connection name.";
            break;
        case 4007:
            lngMessage = "Please enter database username.";
            break;
        case 4008:
            lngMessage = "A connection with name {0} already exist."
            break;
        case 4009:
            lngMessage = "Project has been deleted successfully.";
            break;
        case 4010:
            lngMessage = "{0} does not exist.";
            break;
        case 4011:
            lngMessage = "Project has been saved successfully.";
            break;
        case 4012:
            lngMessage = "Cannot delete default.";
            break;
        case 4013:
            lngMessage = "Files Saved";
            break;
        case 4014:
            lngMessage = "Design Reset Successfully.";
            break;
        case 4015:
            lngMessage = "Design Saved Successfully.";
            break;
        case 4016:
            lngMessage = "No Tasks Available.";
            break;
        case 4017:
            lngMessage = "Cannot assign tasks to the same user.";
            break;
        case 4018:
            lngMessage = "Tasks Assigned successfully.";
            break;
        case 4019:
            lngMessage = "Please select a task to delegate.";
            break;
        case 4020:
            lngMessage = "Invalid UserName";
            break;
        case 4021:
            lngMessage = "Please select user.";
            break;
        case 4022:
            lngMessage = "Please select task to delegate.";
            break;
        case 4022:
            lngMessage = "User is not available";
            break;
        case 4023:
            lngMessage = "This row cannot be deleted.";
            break;
        case 4024:
            lngMessage = "Invalid Max Days.";
            break;
        case 4025:
            lngMessage = "Invalid Max Hrs.";
            break;
        case 4026:
            lngMessage = "Workflow saved successfully.";
            break;
        case 4027:
            lngMessage = "Please select/enter workflow name";
            break;
        case 4028:
            lngMessage = "Please click update/cancel";
            break;
        case 4029:
            lngMessage = "Please select the workflow";
            break;
        case 4030:
            lngMessage = "Please select a workflow";
            break;
        case 4031:
            lngMessage = "Please select a Transaction and workflow";
            break;
        case 4032:
            lngMessage = "Unable to export, please try again.";
            break;
        case 4033:
            lngMessage = "No Data to export.";
            break;
        case 4034:
            lngMessage = "Cannot change admin password.";
            break;
        case 4035:
            lngMessage = "There are no import structures available.";
            break;
        case 4036:
            lngMessage = "File is Empty.";
            break;
        case 4037:
            lngMessage = "File uploaded successfully.";
            break;
        case 4038:
            lngMessage = "File doesnot contain any rows.";
            break;
        case 4039:
            lngMessage = "Columns in data file does not match selected fields.Please close and reinitiate the Import functionality again with proper file.";
            break;
        case 4040:
            lngMessage = "File could not be uploaded. Filesize is more than 1MB.";
            break;
        case 4041:
            lngMessage = "An Error Occured. Please Try Again!";
            break;
        case 4042:
            lngMessage = "Please select form and choose a file.";
            break;
        case 4043:
            lngMessage = "Please select form.";
            break;
        case 4044:
            lngMessage = "Please choose a file.";
            break;
        case 4045:
            lngMessage = "Data imported successfully";
            break;
        case 4046:
            lngMessage = "Data imported partially please check the summary for failed records.";
            break;
        case 4047:
            lngMessage = "No Data imported please check the summary for failed records.";
            break;
        case 4048:
            lngMessage = "No Data imported due to an error.";
            break;
        case 4049:
            lngMessage = "Your session is expired. Please login again.";
            break;
        case 4050:
            lngMessage = "Design Saving Failed. Please check if Design Table exist.";
            break;


        case 5001:
            lngMessage = "Exported with error -"
            break;
        case 5002:
            lngMessage = "Records successfully exported."
            break;

        case 5003:
            lngMessage = "Grid is not Empty."
            break;
        case 5004:
            lngMessage = "Data cannot be exported as there are no records."
            break;
        case 5005:
            lngMessage = "New Password cannot be only empty space"
            break;

        default:
            lngMessage = "Content is not defined";
            break;
    }
    return lngMessage;
}

// These varables are required for inline messagess 
var lcm = [];
lcm[0] = "No data found.";
lcm[1] = "Your file should start downloading in 15 seconds";
lcm[2] = "Your file should start downloading in {0} seconds";
lcm[3] = "Please define a target elemnt #id or .class";
lcm[4] = "Target element does not exists.";
lcm[5] = "Deleted entries cannot be recovered. Do you want to proceed?";
lcm[6] = "Please click go to refresh the data";
lcm[7] = "{0}. Do you want to continue?";
lcm[8] = "Enter search parameter";
lcm[9] = "Are you sure you want to delete?";
lcm[10] = "Unknown problem occured. Please try after logging in again.";
lcm[11] = "No records.";
lcm[12] = "Total no. of filtered Rows : {0} of {1}";
lcm[13] = "_name_ cannot be empty.";
lcm[14] = "Please enter a valid name.";
lcm[15] = "Entered value is not numeric.";
lcm[16] = "Please select any _option_.";
lcm[17] = "Please select a chart.";
lcm[18] = "Atleast one column should be selected.";
lcm[19] = "Please select an d ownload option.";
lcm[20] = "You reached maximum no.of _type_s, Please delete unwanted _type_s to proceed.";
lcm[21] = "{0} name already exists";
lcm[22] = "Please enable the dependent colums.";
lcm[23] = "Sorry limit is exceeded we cant add more pills";
lcm[24] = "No local storage";
lcm[25] = "Existing {0} rows will be cleared. Do you want to proceed?";
lcm[26] = "Existing data will be overwriten. Do you want to proceed?";
lcm[27] = "Do you really want to log out?";
lcm[28] = "No docs available to print.";
lcm[29] = "There are some unsaved changes. Do you really want to leave this page?";
lcm[30] = "Disconnected because you have logged into another session";
lcm[31] = "You have unsaved data. Do you want to proceed?";
lcm[32] = "No Modules available";
lcm[33] = "Your Session will expire in";
lcm[34] = "Do you want to reset?";
lcm[35] = "5 Mins";
lcm[36] = "Do you want to save the existing data in {0} & proceed?";
lcm[37] = "Existing data in {0} will be lost. Do you want to proceed?";
lcm[38] = "Please enter comments/remarks.";
lcm[39] = "Remarks";
lcm[40] = "Characters Left : ";
lcm[41] = "is already submitted for signature";
lcm[42] = "Click here to withdraw this document";
lcm[43] = "Click here to overwrite this docuement";
lcm[44] = "Transaction has been cancelled";
lcm[45] = "cannot be left empty";
lcm[46] = "This record is already opened by user ";
lcm[47] = "Do you want to remove the file?";
lcm[48] = "Please select a responsibility to copy.";
lcm[49] = "Only one responsibility can be copied at a time.";
lcm[50] = "Please select a role to copy.";
lcm[51] = "Only one role can be copied at a time.";
lcm[52] = "Click on Cancel to Ignore.";
lcm[53] = "Invalid email address.";
lcm[54] = "Only characters are allowed.";
lcm[55] = "Only numbers are allowed.";
lcm[56] = "Only alphanumeric characters are allowed.";
lcm[57] = "Only Numbers commas and hyphens allowed.";
lcm[58] = "Do you want to continue?";
lcm[59] = "Do you want to remove?";
lcm[60] = "cannot be empty.";
lcm[61] = "Cancelled entries cannot be recovered. Do you want to proceed?";
lcm[62] = "Do you want to remove this file?";
lcm[63] = "Server Error. Try Again.";
lcm[64] = "This transaction has been cancelled.";
lcm[65] = "Do you want to remove the group?";
lcm[66] = "No file chosen...";

lcm[67] = "Do you want to delete?";
lcm[68] = "Do you want to modify existing Connection?";
lcm[69] = "Password must contain alpha numeric.";
lcm[70] = "Are you sure to refresh all the available selections permanently?";
lcm[71] = "Are you sure to delete all the available selections permanently?";
lcm[72] = "Password Should be Minimum {0} Characters";
lcm[73] = "unhandled node type:";
lcm[74] = "cannot parse xml string!";
lcm[75] = "Default values will be loaded...";
lcm[76] = "Record Saved";
lcm[77] = "Draft save failed.";
lcm[78] = "Draft saved at:";
lcm[79] = "Configuration Saved";
lcm[80] = "File size should be less than {0} MB";
lcm[81] = "Image file size should be less than {0} MB";
lcm[82] = "File size exceeded the max limit, please upload a file less than {0} MB";
lcm[83] = "Image file size exceeded the max limit, please upload a file less than {0} MB";
lcm[84] = "Please select a Role to delete.";
lcm[85] = "Please select a Responsibility to delete.";
lcm[86] = "Please select a User to delete.";
lcm[87] = "Are you sure, you want to delete?";
lcm[88] = "Start date cannot be less than Current date.";
lcm[89] = "End date cannot be less than Start date.";
lcm[90] = "Please enter the responsibility name.";
lcm[91] = "Special Characters are not allowed in Responsibility name.";
lcm[92] = "Please select an access right.";
lcm[93] = "Please enter the role.";
lcm[94] = "Special Characters are not allowed in Role name.";
lcm[95] = "Please select a responsibility.";
lcm[96] = "Please enter the Username.";
lcm[97] = "Special Characters are not allowed in User name.";
lcm[98] = "Please enter the password.";
lcm[99] = "Please enter the Confirm  password.";
lcm[100] = "The passwords entered do not match, Please retype the passwords.";
lcm[101] = "Please enter integer value in Password expiry days.";
lcm[102] = "Please enter the Email-id.";
lcm[103] = "Please select a Role.";
lcm[104] = "Invalid E-mail ID";
lcm[105] = "There are some unsaved changes. Do you want to Save?";
lcm[106] = "Please select form.";
lcm[107] = "Please select file type.";
lcm[108] = "Please select fields.";
lcm[109] = "Please enter a valid file name.";
lcm[110] = "Please enter file name.";
lcm[111] = "Are you sure, you want to exit exporting data?";
lcm[112] = "Please select the source table.";
lcm[113] = "Please upload file.";
lcm[114] = "Please select all column header.";
lcm[115] = "Are you sure, you want to exit importing data?";
lcm[116] = "Object Browser is used to select the various components for the Home page, which are building blocks for your home page. You can either double click or drag & drop the component to the Designer Canvas. Property sheet should be used for changing the behaviour of each component."
lcm[117] = "After building the Home page you should click on the Save option. There is seperate option to publish the changes made to the Home page.";
lcm[118] = "After saving the changes please click on Publish icon, this will publish the changes made to the Home page to all Users.";
lcm[119] = "Please enter your descripton here.";
lcm[120] = "No Roles assigned";
lcm[121] = "Do you want to discard the unsaved changes?";
lcm[122] = "Changes saved successfully";
lcm[123] = "Changes published successfully";
lcm[124] = "Signing out. This account is currently being used in one other location.";
lcm[125] = "There is no drilldown chart";
lcm[126] = "Quicklink deleted successfully";
lcm[127] = "No quicklinks available";
lcm[128] = "Quicklink updated successfully";
lcm[129] = "Please select chart type.";
lcm[130] = "Please enter the title of the widget";
lcm[131] = "Please enter the SQL statement";
lcm[132] = "Invalid select statement";
lcm[133] = "Please validate the SQL Statement";
lcm[134] = "Please select the tstruct.";
lcm[135] = "Please select the table.";
lcm[136] = "Please select the label column.";
lcm[137] = "Please select the value column.";
lcm[138] = "Please select Role.";
lcm[139] = "Validating.…";
lcm[140] = "Please select roles";
lcm[141] = "please select the transaction,";
lcm[142] = "please select the field,";
lcm[143] = "please select the operator,";
lcm[144] = "please select the value1,";
lcm[145] = "please select the workflow,";
lcm[146] = "Please enter the title.";
lcm[147] = "Please enter the mandatory fields.";
lcm[148] = "Please select atleast one responsibility.";
lcm[149] = "Widget created successfully!";
lcm[150] = "Widget deleted successfully!";
lcm[151] = "Widget updated successfully!";
lcm[152] = "No changes made.";
lcm[153] = "Please select atleast one column.";
lcm[154] = "Session Expiring!";
lcm[155] = "Confirm!";
lcm[156] = "File could not be uploaded. Filesize should be less than 1 MB.";
lcm[157] = "Please upload CSV/Text file.";
lcm[158] = "No file choosen, Please select a file.";
lcm[159] = "Failed to upload the file.";
lcm[160] = "It is a mandatory field.";
lcm[161] = "All fields are mandatory.";
lcm[162] = "Next";
lcm[163] = "Previous";
lcm[164] = "Confirm";
lcm[165] = "Done";
lcm[166] = "Data Search";
lcm[167] = "Upload";
lcm[168] = "Edit";
lcm[169] = "Summary";
lcm[170] = "Import";

lcm[171] = "Select All";
lcm[172] = "Select";
lcm[173] = "Unselect";
lcm[174] = "Unselect All";
lcm[175] = "Select the field(s) to be included in the export template.";
lcm[176] = "Please download data template to fill your data and import or if you have your data file in the required structure can import the same.";
lcm[177] = "Check this to ignore errors in the rows during file upload.";
lcm[178] = "Download Summary";
lcm[179] = "Select a TStruct from which the data needs to be imported.";
lcm[180] = "Select a TStruct from which the data needs to be exported.";
lcm[181] = "Select the field(s) to be included in the import template.";

lcm[182] = "Select the file format to which the data to be exported.";
lcm[183] = "Select the type of seperator used to separate the column values on each line.";
lcm[184] = "Please specify the file name to which data will be exported.By default the file name will same as the selected form name.";
lcm[185] = "If you wish to export the data with column names, check mark this option.";
lcm[186] = "Use this option to specify how to identify text strings in a column. The default value is double quotation marks.";
lcm[187] = "Remove condition";
lcm[188] = "Add condition";
lcm[189] = "Summary Report";
lcm[190] = "CSV";

lcm[191] = "Discard";
lcm[192] = "Cancel";
lcm[193] = "Widgets";
lcm[194] = "Custom Widget";
lcm[195] = "Image";
lcm[196] = "Static Text";
lcm[197] = "SQL Query";
lcm[198] = "RSS Feed";
lcm[199] = "My Tasks";
lcm[200] = "Save";
lcm[201] = "Publish";
lcm[202] = "Object Browser";
lcm[203] = "Designer Canvas";
lcm[204] = "Property Sheet";
lcm[205] = "General";
lcm[206] = "Component";
lcm[207] = "Title";
lcm[208] = "Target Type";
lcm[209] = "Target";
lcm[210] = "None";
lcm[211] = "Description";
lcm[212] = "Appearance";
lcm[213] = "Title Region";
lcm[214] = "Image Responsive";
lcm[215] = "Icon";
lcm[216] = "Icon Color";
lcm[217] = "Title Color";
lcm[218] = "Title Background Color";
lcm[219] = "Floating Menu Background Color";
lcm[220] = "Floating Menu Text Color";
lcm[221] = "Body text Color";
lcm[222] = "Body Background Color";
lcm[223] = "Authorization";
lcm[224] = "Responsibility";
lcm[225] = "Activity Log";
lcm[226] = "Modified By";
lcm[227] = "Modified On";
lcm[228] = "Source";
lcm[229] = "Tstruct";
lcm[230] = "Iview";
lcm[231] = "Filter";
lcm[232] = "Export";
lcm[233] = "Complete";
lcm[234] = "Please Wait...";
lcm[235] = "Please select all mandatory fields.";
lcm[236] = "Total records exported with error: ";
lcm[237] = "Total records exported: ";
lcm[238] = "Unable to export, please try again.";
lcm[239] = "No Data to export";
lcm[240] = "Home";
lcm[241] = "PDF";
lcm[242] = "Print";
lcm[243] = "Excel";
lcm[244] = "New";
lcm[245] = "List View";
lcm[246] = "Restore Defaults";
lcm[247] = "Refresh selected key";
lcm[248] = "Delete";
lcm[249] = "Close";

//Menu keys
lcm[250] = "Export Data";
lcm[251] = "Import Data";
lcm[252] = "Change Password";
lcm[253] = "Trace File";
lcm[254] = "Log Out";
lcm[255] = "Import History";
lcm[256] = "In-Memory DB";
lcm[257] = "Widget Builder";
lcm[258] = "Global settings";

lcm[259] = "There are no Forms available.";
lcm[260] = "No Fields available for the selected Form.";
lcm[261] = "Error while creating template. Please try again.";
lcm[262] = "Error while displaying records. Please try again.";
lcm[263] = "File Name";
lcm[264] = "Total No. of Records";
lcm[265] = "Success";
lcm[266] = "Failed";

//Fast data utility page
lcm[267] = "Selected keys has been deleted successfully.";
lcm[268] = "Failed to delete the selected keys.";
lcm[269] = "Selected keys has been refreshed successfully.";
lcm[270] = "Failed to refresh the selected keys.";
lcm[271] = "Dataset is refreshed successfully.";
lcm[272] = "All keys were deleted successfully.";
lcm[273] = "Failed to load ";
lcm[274] = "memory usage";
lcm[275] = "Redis key list";
lcm[276] = "Are you sure you want to refresh the selected key(s)?";
lcm[277] = "Are you sure you want to delete the selected key(s)?";
lcm[278] = "No key selected.";

lcm[279] = "Yes";
lcm[280] = "No";
lcm[281] = "Ok";
lcm[282] = "Continue";
lcm[283] = "Signout";

lcm[284] = "Do you want to save the changes?";

lcm[285] = "Are you sure, you want to exit In-Memory DB?";
lcm[286] = "Delete selected key";

//jquery datatable options text for Search, pagination, no records found
lcm[287] = "Search records...";
lcm[288] = "Display _MENU_ records per page";
lcm[289] = "(filtered from _MAX_ total records)";
lcm[290] = "Showing page _PAGE_ of _PAGES_";

lcm[291] = "Memory details in MB";
lcm[292] = "Are you sure, you want to exit Config App?";

lcm[293] = "Please upload a file";
lcm[294] = "No Camera Found";

//change password
lcm[295] = "Existing Password";
lcm[296] = "New Password";
lcm[297] = "Confirm Password";

lcm[298] = "Prev";
lcm[299] = "Next";
lcm[300] = "Save & New";



//Cancelled transaction
lcm[301] = "Cannot delete - Cancelled transaction";

lcm[300] = "Save & New";
lcm[301] = "Options";
lcm[302] = "Clear Data";

//Cancelled transaction
lcm[303] = "Cannot delete - Cancelled transaction";

//Image upload not more than 5MB
lcm[304] = "Image could not be uploaded. Imagesize should be less than 5 MB.";
lcm[305] = "Invalid file format."
lcm[306] = "Video could not be uploaded. Videosize should be less than 10 MB.";


//Import data - file upload section
lcm[307] = "If allow update is checked,the rows will be updated using the primary key.";
lcm[308] = "Select character used for separating columns in the data file.";
lcm[309] = "Form contains data grid, please select column with unique values."
lcm[310] = "Data file does not contain selected column separator."

//
lcm[311] = "Your previous session will get signed out automatically. Do you want to continue?"

lcm[312] = "No keys found.";

//Responsibilities
lcm[313] = "Responsibilities";
lcm[314] = "Add";
lcm[315] = "Copy"
lcm[316] = "Access Rights";
lcm[317] = "All";
lcm[318] = "Clear";
lcm[319] = "Are you sure, you want to exit?";
lcm[320] = "No pages found";
lcm[321] = "Responsibility updated successfully."
lcm[322] = "Responsibility added successfully.";
lcm[323] = "Responsibility deleted successfully.";
lcm[324] = "Responsibility copied successfully.";
lcm[325] = "Failed to load Responsibilities.";
lcm[326] = "Please enter Responsibility name to search";
lcm[327] = "Operator";


//User access - Tstruct/Iview
lcm[328] = "User Access";
lcm[329] = "DCs";
lcm[330] = "Fields";
lcm[331] = "Buttons"
lcm[332] = "ListView Buttons"
lcm[333] = "View Control";
lcm[334] = "Transaction Control";
lcm[335] = "View";
lcm[336] = "Enable";
lcm[337] = "Expression";
lcm[338] = "Transaction Control saved successfully."
lcm[339] = "User Access Iview saved Successfully.";
lcm[340] = "User Access Tstruct saved Successfully.";
lcm[341] = "Please add/update a Transaction control.";
lcm[342] = "Unable to update Transaction control.";
lcm[343] = "Please select Field/Column.";
lcm[344] = "Please select an Operator.";
lcm[345] = "Please select a Value.";
lcm[346] = "Unable to get Transaction control details.";
lcm[347] = "Unable to delete Transaction control.";
lcm[348] = "Transaction control deleted successfully.";
lcm[349] = "Please select a valid date range.";
lcm[350] = "Search";
lcm[351] = "Select Field/Column";
lcm[352] = "Values";
lcm[353] = "DC Name";
lcm[354] = "Field Name";
lcm[355] = "Button Name";

//popup blocked error in exec command(tstruct)
lcm[356] = "It appears you are using a popup blocker, we recommend you to disable your popup blocker.";

lcm[357] = "Added";
lcm[358] = "Updated";

lcm[359] = "Grid File Upload";
lcm[360] = "Attach";


//Fast data utility page
lcm[361] = "Unable to connect Redis server.";
lcm[362] = "Please select a file with valid extension.";


//Design Mode 
lcm[363] = "Internal server error. Please check your node server is running.";
lcm[364] = "Design Saved Successfully.";
lcm[365] = "Internal server error. Please check your node server is running.";
lcm[366] = "No modification has been Made.";
lcm[367] = "Please save before publishing.";
lcm[368] = "Design Published Successfully.";
lcm[369] = "Publish Failed.";
lcm[370] = "Reset Successfully.";
lcm[371] = "Already Reset.";
lcm[372] = "Reset Failed.";
lcm[373] = "Do you want to reset design to default?";
lcm[374] = "Definitions changed since last update, please redesign accordingly.";

//Axpert Logs
lcm[375] = "Axpert Logs";
lcm[376] = "Modified by";
lcm[377] = "Modified on";
lcm[378] = "Other Info";
lcm[379] = "Field modified";
lcm[380] = "Old value";
lcm[381] = "New value";
lcm[382] = "Show Details";
lcm[383] = "Hide Details";

//IView Configuration Messages
lcm[384] = "IView cache size should be 1000 and above";
lcm[385] = "Preferred rows per page should not exceed 50% of iview cache size for improved performance";

//Config Page
lcm[386] = "Unlock";
lcm[387] = "About Axpert Web";
lcm[388] = "Timeout value should be greater than 1 and less than or equals 10";
lcm[389] = "Log in";

//Load all records in iview
lcm[390] = "Loading all the records can take longer time than expected, Do you want to continue?";
lcm[391] = "Enter a value between 10 and 10000";
lcm[392] = "Submit";
lcm[393] = "Reset";
lcm[394] = "Chart";
lcm[395] = "Group";
lcm[396] = "Highlight";
lcm[397] = "Type for search...";
lcm[398] = "WorkFlow";
//SmartViews
lcm[399] = "Save"
lcm[400] = "Save View";
lcm[401] = "Columns";
lcm[402] = "Chart";
lcm[403] = "Sort";
lcm[404] = "Row Grouping";
lcm[405] = "Data";
lcm[406] = "Options";
lcm[407] = "Tasks";
lcm[408] = "Print";
lcm[409] = "Filters";
lcm[410] = "Charts";
lcm[411] = "Download";
lcm[412] = "Row Grouping";
lcm[413] = "Name";
lcm[414] = "Value";
lcm[415] = "Search...";
lcm[416] = "Create Filter";
lcm[417] = "Enter filter name for creating filter";
lcm[418] = "Reset advanced filters";
lcm[419] = "Pie";
lcm[420] = "Column";
lcm[421] = "Donut";
lcm[422] = "Bar";
lcm[423] = "Format";
lcm[424] = "Condition";
lcm[425] = "Background Colour";
lcm[426] = "Text Colour";
lcm[427] = "From";
lcm[428] = "To";
lcm[429] = "Please select the column, which will be used for data grouping.";
lcm[430] = "Please enter name for the Group. Example: Group Department.";
lcm[431] = "Please enter name for the Chart Type. Example: Sales Distribution.";
lcm[432] = "Please select column, which should be used for Grouping and Data label.";
lcm[433] = "Please select the column, which will be used as Chart Data.";
lcm[434] = "Some content inside the popover";
lcm[435] = "Please enter name for the Highlight. Example: Top 5 Stocks on ROI.";
lcm[436] = "Choose the background color for matching condition.";
lcm[437] = "Choose the Text color for matching condition.";
lcm[438] = "Select the column which should be used for matching condition.";
lcm[439] = "Select the condition depending on column.";
lcm[440] = "Enter expression or value, which will be used for matching condition. Example: If you want to search Country starts with A and ends with h, select column as Country, Condition Regex and value as ^A[a-z ]*$";
lcm[441] = "--Select--";
lcm[442] = "Apply";
lcm[443] = "Clear Filters";
lcm[444] = "Reset Filters";
lcm[445] = ["Custom", "Today", "Yesterday", "Tomorrow", "This week", "Last week", "Next week", "This month", "Last month", "Next month", "This quarter", "Last quarter", "Next quarter", "This year", "Last year", "Next year"];
lcm[446] = "Show all";
lcm[447] = "Move Up";
lcm[448] = "Move Down";

//Cross Site Scripting Detection
lcm[449] = "Invalid input detected, Please try again.";

//Change password alphanumeric and special character validation error message
lcm[450] = "Password should be alphanumeric characters."
lcm[451] = "Contains";
lcm[452] = "Starts with";
lcm[453] = "Vertical Split";
lcm[454] = "Horizontal Split";
lcm[455] = "Clear Split";
lcm[456] = "Refresh Menu";
lcm[457] = "Sign Out";
lcm[458] = "Dashboard";
lcm[459] = "Audit report";
lcm[460] = "Show Logs";
lcm[461] = "Scan the QR code";
lcm[462] = "Page Builder";
lcm[463] = "About";
lcm[464] = "InMemory DB";
lcm[465] = "Trace On";
lcm[466] = "Trace Off";
lcm[467] = "Developer Options";
lcm[468] = "Global Params";
lcm[469] = "History";
lcm[470] = "Utilities";
lcm[471] = "Settings";
lcm[472] = "Mobile";
lcm[473] = "Settings Panel";
lcm[474] = "Split";
lcm[475] = "Comments should not be empty";
lcm[476] = "It is recommended to clear InMemory DB after changing this setting, do you want to clear InMemory DB?";
//Grid Button
lcm[477] = "Add Row";
//iview parameters
lcm[478] = "Parameters";
lcm[479] = "Compressed UI";
lcm[480] = "Compressed UI On";
lcm[481] = "Compressed UI Off";
lcm[482] = "Add View";
lcm[483] = "This View name cannot be used.";
lcm[484] = "You don't have permission to delete this view";
//Tstruct Grid Export
lcm[485] = "Do you want to export the header id row as well?";
lcm[486] = "Export to Excel";
lcm[487] = "Password should be alphanumeric, contains one UpperCharacter, one LowerCharacter with atleast one special character.";
lcm[488] = "Notifications";
lcm[489] = "File Upload";
lcm[490] = "Upload";
lcm[491] = "This proces is taking more time than expected. You will get a notification once completed.";
lcm[492] = "User Manual";
//Custom Field Type validations
lcm[493] = "Please enter a valid IP Address.";
lcm[494] = "Please enter a valid Web site.";
lcm[495] = "Please enter a valid Mobile Number.";
lcm[496] = "Please enter a valid Phone Number.";
lcm[497] = "Please enter a valid Pincode.";
lcm[498] = "Please enter a valid Zip code.";
//smartview export
lcm[499] = "Do you want to export Current record set or all records? (Loading all the records can take longer time than expected)";
lcm[500] = "All Records";
lcm[501] = "Current Records";
lcm[502] = "Please enter a valid URL.";
lcm[503] = "Show Execution Trace";
lcm[504] = "Mobile Notification";
lcm[505] = "Mobile Notification off";
lcm[506] = "Mobile Notification on";
lcm[507] = "Refresh App Variables";
lcm[508] = "Language";
lcm[509] = "File is empty";
lcm[510] = "Coloum Headers not matching with Grid Coloumns";
lcm[511] = "No row data is there";
lcm[512] = "Deleted Application Informations cannot be retreived. Do you want to delete?";
lcm[513] = "Password length should be greater than or equal _ characters."
lcm[514] = "Password should be numeric."
lcm[515] = "File not saved in server, kindly delete and upload once again!";
lcm[516] = "This file missed in file server, please upload again!";
lcm[517] = "Not a valid row!";
lcm[518] = "There was an error please try again or continue with another user.";
lcm[519] = "It will clear the existing data and load new data.";
lcm[520] = "Entered {0} data will be cleared on confirmation. Do you want to proceed?";
lcm[521] = "Selected file type not allowed in this form as per the setting.";
lcm[522] = "Deleted Informations cannot be retreived. Do you want to delete?";