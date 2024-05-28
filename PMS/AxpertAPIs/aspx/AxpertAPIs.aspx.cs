using DocumentFormat.OpenXml.Spreadsheet;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
//using System.Net.PeerToPeer;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Services;
using System.Diagnostics;
using System.Security.Policy;
using System.Xml.Linq;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Net.Mime;
using System.Web.Routing;

public partial class AxPlugins_AxpertAPIs_aspx_AxpertAPIs : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    private static string CallWebAPI(string url, string method = "GET", string contentType = "application/json", string body = "", string calledFrom = "")
    {
        string result = string.Empty;
        try
        {
            if (url.ToLower().IndexOf("getactivetasks") > -1)
            {

            }
            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(url);
            httpRequest.Method = method;
            httpRequest.ContentType = contentType;
            if (url.ToLower().IndexOf("https") == -1)
            {
                httpRequest.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;
            }
            if (HttpContext.Current.Session["ARM_Token"] != null && HttpContext.Current.Session["ARM_Token"].ToString() != string.Empty)
            {
                var token = HttpContext.Current.Session["ARM_Token"].ToString();
                httpRequest.Headers.Add("Authorization", "Bearer " + token);
            }

            using (var streamWriter = new StreamWriter(httpRequest.GetRequestStream()))
            {
                streamWriter.Write(body);
            }

            var httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                result = streamReader.ReadToEnd();
            }
        }
        catch (WebException e)
        {
            try
            {
                using (WebResponse response = e.Response)
                {
                    HttpWebResponse httpResponse = (HttpWebResponse)response;
                    Console.WriteLine("Error code: {0}", httpResponse.StatusCode);

                    if (calledFrom == "" && httpResponse.StatusCode == HttpStatusCode.Unauthorized)
                    {
                        return RefreshSessionAndRecallAPI(url, method, contentType, body, calledFrom = "Error");
                    }

                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        result = reader.ReadToEnd();
                    }

                    if (calledFrom == "" && result.IndexOf("SessionId is not valid") > -1)
                    {
                        return RefreshSessionAndRecallAPI(url, method, contentType, body, calledFrom = "Error");
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
        }
        catch (Exception e)
        {
            result = e.Message;
        }
        return result;
    }

    private static string RefreshSessionAndRecallAPI(string url, string method = "GET", string contentType = "application/json", string body = "", string calledFrom = "")
    {
        HttpContext.Current.Session.Remove("ARM_SessionId");
        HttpContext.Current.Session.Remove("ARM_Token");
        var ARMSessionId = GetARMSessionId();
        try
        {
            var jsonBody = JObject.Parse(body);
            if (jsonBody["ARMSessionId"] != null)
            {
                jsonBody["ARMSessionId"] = ARMSessionId;
                body = JsonConvert.SerializeObject(jsonBody);
            }
        }
        catch { }
        return CallWebAPI(url, method, contentType, body, calledFrom = "Error");
    }

    private static string MD5Hash(string text)
    {
        MD5 md5 = new MD5CryptoServiceProvider();

        //compute hash from the bytes of text  
        md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(text));

        //get hash result after compute it  
        byte[] result = md5.Hash;

        StringBuilder strBuilder = new StringBuilder();
        for (int i = 0; i < result.Length; i++)
        {
            //change it into 2 hexadecimal digits  
            //for each byte  
            strBuilder.Append(result[i].ToString("x2"));
        }

        return strBuilder.ToString();
    }

    private static string GetARMSessionId()
    {
        try
        {
            var ARMSessionId = "";
            string sessionId = HttpContext.Current.Session.SessionID;
            if (HttpContext.Current.Session["ARM_SessionId"] == null)
            {
                //string privateKey = ConfigurationManager.AppSettings["ARM_PrivateKey"].ToString();
                string privateKey = String.Empty;
                if (HttpContext.Current.Session["ARM_PrivateKey"] != null)
                    privateKey = HttpContext.Current.Session["ARM_PrivateKey"].ToString();
                else
                    return "Error in ARM connection.";

                string hashedKey = MD5Hash(privateKey + sessionId);
                var axpertDetails = new
                {
                    user = HttpContext.Current.Session["user"].ToString(),
                    key = hashedKey,
                    AxSessionId = sessionId,
                    Trace = HttpContext.Current.Session["AxTrace"].ToString(),
                    AppName = HttpContext.Current.Session["project"].ToString()
                };
                string ARM_URL = string.Empty;
                if (HttpContext.Current.Session["ARM_URL"] != null)
                    ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();
                else
                    return "Error in ARM connection.";
                string connectionUrl = ARM_URL + "/api/v1/ARMConnectFromAxpert";

                var connectionResult = CallWebAPI(connectionUrl, "POST", "application/json", JsonConvert.SerializeObject(axpertDetails));

                var jObj = Newtonsoft.Json.Linq.JObject.Parse(connectionResult);
                if (jObj != null && jObj["result"] != null)
                {
                    if (Convert.ToBoolean(jObj["result"]["success"]))
                    {
                        ARMSessionId = jObj["result"]["connectionid"].ToString();
                        var token = jObj["result"]["token"].ToString();
                        HttpContext.Current.Session["ARM_SessionId"] = ARMSessionId;
                        HttpContext.Current.Session["ARM_Token"] = token;
                    }
                    else
                    {
                        return "Error in ARM connection.";
                    }
                }
            }
            else
            {
                ARMSessionId = HttpContext.Current.Session["ARM_SessionId"].ToString();
            }
            return ARMSessionId;
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }

    [WebMethod(EnableSession = true)]
    public static string CallDataSourceAPI(string apiPublicKey, Dictionary<string,string> sqlParams)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }

        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();
        else
            return "Error in ARM connection.";
        string tasksUrl = ARM_URL + "/api/v1/ARMExecutePublishedAPI";

        var connectionDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Project = HttpContext.Current.Session["project"].ToString(),
            PublicKey = apiPublicKey,
            UserName = HttpContext.Current.Session["username"].ToString(),
            GetSqlData = new {
                Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            },
            SqlParams = sqlParams
        };

        var tasks = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(connectionDetails));
        return tasks;
    }

    [WebMethod(EnableSession = true)]
    public static string AxSetValue(string apiPublicKey, string fieldName, string dcNo, string rowNo, string value) {
        Dictionary<string, Dictionary<string, Dictionary<string, string>>> data = new Dictionary<string, Dictionary<string, Dictionary<string, string>>>();
        if (HttpContext.Current.Session["AxAPISubmitData-" + apiPublicKey] != null)
        {
            data = (Dictionary<string, Dictionary<string, Dictionary<string, string>>>)HttpContext.Current.Session["AxAPISubmitData-" + apiPublicKey];
        }
        else { }

        if (!data.ContainsKey("dc" + dcNo))
        {
            data["dc" + dcNo] = new Dictionary<string, Dictionary<string, string>>();
        }

        // Check for RowNo and add if not present
        if (!data["dc" + dcNo].ContainsKey("row" + rowNo))
        {
            data["dc" + dcNo]["row" + rowNo] = new Dictionary<string, string>();
        }

        // Add or update the FieldName with the value
        data["dc" + dcNo]["row" + rowNo][fieldName] = value;
        HttpContext.Current.Session["AxAPISubmitData-" + apiPublicKey] = data;

        return "Added";
    }

    [WebMethod(EnableSession = true)]
    public static string CallSubmitDataAPI(string apiPublicKey, string recordId)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }

        if (HttpContext.Current.Session["AxAPISubmitData-" + apiPublicKey] == null) {
            return "Error. Field data is not available for save.";
        }

        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();
        else
            return "Error in ARM connection.";
        string tasksUrl = ARM_URL + "/api/v1/ARMExecutePublishedAPI";

        var data = new Dictionary<string, object>();
        data["mode"] = "new";
        data["keyvalue"] = "";
        data["recordid"] = recordId;

        var fieldData = (Dictionary<string, Dictionary<string, Dictionary<string, string>>>)HttpContext.Current.Session["AxAPISubmitData-" + apiPublicKey];
        foreach (var fData in fieldData)
        {
            data.Add(fData.Key, (object)fData.Value);
        }

        var connectionDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Project = HttpContext.Current.Session["project"].ToString(),
            PublicKey = apiPublicKey,
            UserName = HttpContext.Current.Session["username"].ToString(),
            SubmitData = new
            {
                trace = HttpContext.Current.Session["AxTrace"].ToString(),
                keyfield = "",
                dataarray = new
                {
                    data = data
                }
            }
        };

        var tasks = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(connectionDetails));
        return tasks;
    }
}