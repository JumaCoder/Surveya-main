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
using System.Net;
using System.Net.Mail;
using System.Diagnostics;
using System.IO;
using System.Configuration;
using System.Net.Configuration;
using System.Web.Script.Serialization;
using RRZTools;
using System.Data.Entity.Validation;
using System.Drawing;
using System.Text.RegularExpressions;
using System.Drawing.Imaging;

namespace SurveyaPayment
{
    public static class Helper
    {
        /// <summary>
        /// Used to send an email to a user
        /// </summary>
        /// <param name="to">The email address(es) to send the message to.</param>
        /// <param name="subject">The subject of the email</param>
        /// <param name="message">The Actual Message</param>
        /// <param name="isHTML">If the message is in HTML format.</param>
        /// <param name="from">the from address(leave out if you want to use the default, or make it null)</param>
        /// <returns>true if the email was sent, or a message otherwise.</returns>
        public static string SendMail(string to, string subject, string message, bool isHTML = false, string from = null)
        {
            var section = ConfigurationManager.GetSection("system.net/mailSettings/smtp") as SmtpSection;
            MailMessage mm = new MailMessage(from == null ? section.From : from, to);
            SmtpClient smtp = new SmtpClient();
            LogMessage(section.Network.UserName + " " + section.Network.Password + " " + section.From + " " + smtp.Host + " " + smtp.Port);
            smtp.Credentials = new NetworkCredential(section.Network.UserName, section.Network.Password);
            mm.Subject = subject;
            mm.IsBodyHtml = isHTML;
            mm.Body = message;
            try
            {
                smtp.Send(mm);
            }
            catch (Exception ee)
            {
                LogError(ee.Message, ee.StackTrace);
                return Utils.WrapError(ee.Message);

            }
            return "true";
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

        /// <summary>
        /// Used to Retrieve a mail template and return the string back
        /// </summary>
        /// <param name="TemplateToRetrieve">The name of the template to retrieve.</param>
        /// <returns>A string containing the template text.</returns>
        public static string RetrieveMailTemplate(string TemplateToRetrieve)
        {
            string templateText = "";
            StreamReader reader = null;
            try
            {
                reader = new StreamReader(new BufferedStream(new FileStream(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["EmailTemplateBasePath"].ToString() + TemplateToRetrieve), FileMode.Open, FileAccess.Read)));
                templateText = reader.ReadToEnd();
                return templateText;

            }
            catch (Exception ee)
            {
                LogError(ee.Message, ee.ToString());
                return Utils.WrapError(ee.Message);
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }
            }

        }

        /// <summary>
        /// Generates a clean error message for any entity validation error that may occur.
        /// </summary>
        /// <param name="EntityException">The exception from the catch</param>
        /// <returns>A string representation of the cleaned error.</returns>
        public static string GetCleanEntityValidationErrors(DbEntityValidationException EntityException)
        {
            string errors = "";
            foreach (var eve in EntityException.EntityValidationErrors)
            {
                errors = String.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                    eve.Entry.Entity.GetType().Name, eve.Entry.State);
                foreach (var ve in eve.ValidationErrors)
                {
                    errors += String.Format("- Property: \"{0}\", Error: \"{1}\"",
                        ve.PropertyName, ve.ErrorMessage);
                }
            }
            return errors;
        }

        /// <summary>
        /// Converts a base64 string to an Image
        /// </summary>
        /// <param name="base64String">The base 64 string</param>
        /// <returns>The Image</returns>
        public static Image Base64ToImage(string base64String)
        {
            try
            {
                // Convert base 64 string to byte[]
                byte[] imageBytes = Convert.FromBase64String(base64String);

                // Convert byte[] to Image
                using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
                {
                    Image image = Image.FromStream(ms, true);
                    return image;
                }
            }
            catch (Exception ee)
            {
                return null;
            }
        }

        //convert from an image to a string
        public static string ImageToBase64(Image img)
        {
            try
            {
                byte[] imageBytes;
                
                using (var ms = new MemoryStream())
                {
                    img.Save(ms, ImageFormat.Jpeg);
                    imageBytes = ms.ToArray();
                }
                string res = Convert.ToBase64String(imageBytes, 0, imageBytes.Length);;
                
                return res;
            }
            catch (Exception ee)
            {
                return null;
            }
        }

        //convert from an byte array to a string
        public static string ImageBytesToBase64(byte[] imageBytes)
        {
            try
            {
                string res = Convert.ToBase64String(imageBytes, 0, imageBytes.Length); ;

                return res;
            }
            catch (Exception ee)
            {
                return null;
            }
        }

        public static Image GetThumbnailImage(Image originalImg) 
        {

            try
            {
                /**** CALCULATE THE THUMBNAIL SIZE ****/

                // Maximum size of any dimension.
                const int maxPixels = 640;
                // Width and height.
                int originalWidth = originalImg.Width;
                int originalHeight = originalImg.Height;

                // Compute best factor to scale entire image based on larger dimension.
                double factor;
                if (originalWidth > originalHeight)
                {
                    factor = (double)maxPixels / originalWidth;
                }
                else
                {
                    factor = (double)maxPixels / originalHeight;
                }

                // the thumbnail size.
                Size thumbnailSize = new Size((int)(originalWidth * factor), (int)(originalHeight * factor));

                Image thumbnail = originalImg.GetThumbnailImage(
                    thumbnailSize.Width, thumbnailSize.Height, null, IntPtr.Zero);

                return thumbnail;
            }
            catch (Exception ee)
            {
                return null;
            }

        }

        /// <summary>
        /// Used to generate a Random Password (0 is always ZERO Never the letter)
        /// </summary>
        /// <param name="length">The length of the password - defaults to 6 characters</param>
        /// <param name="maxSpecialCharacters">The maximum number of special Characters you want</param>
        /// <param name="maxNumericCharacters">The maximum number of numeric characters to add</param>
        /// <param name="lowercaseOnly">Specify if you would only like lowercase characters</param>
        /// <returns>The Generated Password</returns>
        public static string CreatePassword(int length = 6, int maxSpecialCharacters = 2, int maxNumericCharacters = 2, bool lowercaseOnly = false)
        {
            string NormalCharacters = "abcdefghijklmnpqrstuvwxyz";
            string UpperCaseCharacters = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
            string SpecialCharacters = ".!@";
            string Numbers = "0123456789";

            //create the base string to get the password from (upper and lowercase characters)
            string PasswordGeneratingBase = "";
            if (lowercaseOnly)
            {
                PasswordGeneratingBase = NormalCharacters;
            }
            else
            {
                for (int i = 0; i < NormalCharacters.Length; i++)
                {
                    PasswordGeneratingBase += NormalCharacters[i];
                    if (i < UpperCaseCharacters.Length)
                    {
                        PasswordGeneratingBase += UpperCaseCharacters[i];
                    }
                }
            }

            int NumNumbersUsed = 0;
            int NumSpecialUsed = 0;
            string thePassword = "";
            Random r = new Random();
            int currentRandom = 0;
            for (int i = 0; i < length; i++)
            {
                //check if we are using a number
                currentRandom = r.Next(2);
                if (currentRandom == 1)
                {
                    //use number
                    if (NumNumbersUsed < maxNumericCharacters)
                    {
                        //add a number and continue
                        currentRandom = r.Next(Numbers.Length);
                        thePassword += Numbers[currentRandom].ToString();
                        NumNumbersUsed++;
                        continue;
                    }
                }

                //check if we are using a special character
                currentRandom = r.Next(2);
                if (currentRandom == 1)
                {
                    //use special character
                    if (NumSpecialUsed < maxSpecialCharacters)
                    {
                        //add a special character and continue
                        currentRandom = r.Next(SpecialCharacters.Length);
                        thePassword += SpecialCharacters[currentRandom];
                        NumSpecialUsed++;
                        continue;
                    }
                }

                //add a letter
                currentRandom = r.Next(PasswordGeneratingBase.Length);
                thePassword += PasswordGeneratingBase[currentRandom];
            }
            return thePassword;
        }

        /// <summary>
        /// Used to check if a word has characters that are non alpha numeric
        /// </summary>
        /// <param name="stringToCheck">The string of characters you want to check</param>
        /// <param name="charactersAllowed">The characters in string form that you want to allow in the string i.e "_@#" will allow unerscores (_), @ character and Hashes (#)</param>
        /// <returns>true if it is only Alpha and Numberic Characters false otherwise</returns>
        public static bool IsOnlyAlphaNumeric(string stringToCheck, string charactersAllowed="")
        {
            //ensure that we only allow alpha numeric and underscores
            foreach (Char c in stringToCheck)
            {
                if (!Char.IsLetterOrDigit(c))
                {
                    if(charactersAllowed.Contains(c))
                    {
                        continue;
                    }else{
                        return false;
                    }
                }
            }
            return true;
        }
    }
}