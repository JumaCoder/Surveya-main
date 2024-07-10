/*  Created By		:	Zahed Rassool
 *  Date Created	:	14 March 2014
 *  Title			:	Helper
 *  Purpose			:	Used as a helper class, to send emails or assist with common tasks.
 *  Instructions	:	Make sure that you make all public methods static.
 
 *  Modified By     :
 *  Date Modified   :
 *  Modifications   :
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.IO;
using RRZTools;
using System.Configuration;
using System.Web.Script.Serialization;

namespace Surveya_Application
{
    public class Helper
    {
        /// <summary>
        /// Used to clean a string for JSON use escapes all characters
        /// </summary>
        /// <param name="s">the string to clean</param>
        /// <returns>A clean UNQUOTED string.</returns>
        public static string CleanJSON(string s)
        {
            if (s == null || s.Length == 0)
            {
                return "\"\"";
            }
            char c;
            int i;
            int len = s.Length;
            StringBuilder sb = new StringBuilder(len + 4);
            string t;

            for (i = 0; i < len; i += 1)
            {
                c = s[i];
                if ((c == '\\') || (c == '"'))
                {
                    sb.Append('\\');
                    
                        sb.Append(c);
                   
                }
                else if (c == '\b')
                    sb.Append("\\b");
                else if (c == '\t')
                    sb.Append("\\t");
                else if (c == '\n')
                    sb.Append("\\n");
                else if (c == '\f')
                    sb.Append("\\f");
                else if (c == '\r')
                    sb.Append("\\r");
                else
                {
                    if (c < ' ')
                    {
                        //t = "000" + Integer.toHexString(c); 
                        string tmp = new string(c, 1);
                        t = "000" + int.Parse(tmp, System.Globalization.NumberStyles.HexNumber);
                        sb.Append("\\u" + t.Substring(t.Length - 4));
                    }
                    else
                    {
                        sb.Append(c);
                    }
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// Used to serialize an object to return it as a javascript object.
        /// </summary>
        /// <param name="theObject">The object to serialize</param>
        /// <returns>A string representation of the object converted to a javascript object.</returns>
        public static string SerializeToJavascriptOject(object theObject)
        {
            JavaScriptSerializer theSerializer = new JavaScriptSerializer();
            return theSerializer.Serialize(theObject);
        }

        public static string TestFile(string path)
        {
            if (File.Exists(path))
            {

                StreamReader sr = null;
                try
                {
                    sr = new StreamReader(new BufferedStream(new FileStream(path, FileMode.Open, FileAccess.Read)));
                    string line = sr.ReadLine();
                    string templine = "";
                    while (line != null)
                    {
                        templine = line;
                        line = sr.ReadLine();
                    }
 
                }
                catch (Exception ee)
                {
                    
                    return ee.Message;

                }
                finally
                {
                    if (sr != null)
                    {
                        sr.Close();
                    }
                }
                return "true";
            }
            return "true";
        }

        public static string ValidateKey(string secretKey)
        {
            string username = "undefined";
            try
            {
                //decrypt the string to get the username and password.
                string decryptedInformation = Utils.Decrypt(secretKey);
                string[] userInformation = decryptedInformation.Split(new string[] { "</>" }, StringSplitOptions.None);
                if (userInformation.Length == 3)
                {
                    return decryptedInformation;
                }
                else
                {
                    return Utils.WrapError("Authentication failed, invalid secret key.");
                }

            }
            catch (Exception ee)
            {
                Helper.LogError(username + "-" + ee.Message, ee.StackTrace);
                return Utils.WrapError("Authentication failed:" + ee.Message);
            }
        }

        /// <summary>
        /// Logs an error message using the errorpath from the config file
        /// </summary>
        /// <param name="msg">The error message to log</param>
        /// <param name="stackTrace">The stack trace</param>
        /// <param name="lineNumber">The line number of the issue.</param>
        public static void LogError(string msg, string stackTrace)
        {
            StreamWriter writer = null;
            var retryCount = 3;
            bool keepGoing = true;
            while (keepGoing && retryCount > 0)
            {
                retryCount--;
                try
                {
                    var bs = new BufferedStream(new FileStream(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["ErrorFilePath"]), FileMode.Append, FileAccess.Write));
                    writer = new StreamWriter(bs);
                    writer.WriteLine(DateTime.Now + " - \r\nMessage:\t" + msg + "\r\nStackTrace:\t" + stackTrace + "\r\n\r\n");
                    writer.Close();
                    keepGoing = false;
                }
                catch (Exception)
                {
                    //oh no, there was an exception logging the error.... try logging it again.
                    //dont worry it will retry 3 times and then not work
                }
                finally
                {
                    if (writer != null)
                    {
                        writer.Close();
                    }
                }
            }
        }

        /// <summary>
        /// Logs a message using the logfilepath from the config file
        /// </summary>
        /// <param name="msg">The message you wish to log.</param>
        public static void LogMessage(string msg)
        {
            StreamWriter writer = null;
            var retryCount = 3;
            bool keepGoing = true;
            while (keepGoing && retryCount > 0)
            {
                retryCount--;
                try
                {
                    var bs = new BufferedStream(new FileStream(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["LogFilePath"]), FileMode.Append, FileAccess.Write));
                    writer = new StreamWriter(bs);
                    writer.WriteLine(DateTime.Now + " - \r\nMessage:\t" + msg + "\r\n\r\n");
                    writer.Close();
                    keepGoing = false;
                }
                catch (Exception)
                {
                    //oh no, there was an exception logging the message.... try logging it again.
                    //dont worry it will retry 3 times and then not work
                }
                finally
                {
                    if (writer != null)
                    {
                        writer.Close();
                    }
                }
            }
        }

        public static string CleanError(string data)
        {
            var cleanedData = data.Replace("<error>", "");
            cleanedData = cleanedData.Replace("</error>", "");
            return cleanedData;
        }

        public static bool IsError(string data)
        {
            if (data.IndexOf("<error>") == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}