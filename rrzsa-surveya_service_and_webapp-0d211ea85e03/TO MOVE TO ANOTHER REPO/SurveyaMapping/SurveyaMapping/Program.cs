using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SurveyaMapping
{
    class Program
    {
        enum ModeTypes
        {
            Business, Crime, Education, Employment, HouseholdBusiness, HouseHoldItems,
            HouseholdMembers, Expenses, Income, HealthConditions, HouseLease, LivelyhoodGrazing,
            Livestock, Trees, LivelyhoodVegetables, SkillsTraining, SocialNetworkActivity, SocialNetworkNeighbours,
            SocialServices, HealthClinics, SocialOrganisation, None
        };
        public bool ConvertFromYes(string y)
        {
            y = y.Trim();
            return y.ToLower() == "yes" || y.ToLower() == "y";
        }
        public Program()
        {
            int responseNumber = 286;//needs to be the exact total rows from Main Table
            int arNumber = 0;
            //fields that are required
            string responseID = "";
            string questionID = "";
            string value = "";
            string groupType = "";
            string rowID = "";
            bool newResponse = false;
            int responseCount = 0;

            try
            {
                using (SurveyaEntities entity = new SurveyaEntities())
                {
                    var responses = (from r in entity.Responses
                                     where r.SurveyID.ToString().ToUpper() == "CAB91D67-B5FA-4AB4-88CC-DB50676B2A18"
                                     orderby r.DateCreated
                                     select r
                                     ).ToList();
                    OleDbConnection conn = new OleDbConnection("Provider = Microsoft.ACE.OLEDB.12.0; Data Source = C:\\Projects\\Temp\\to.accdb;");
                    conn.Open();
                    if (responses != null && responses.Count > 0)
                    {
                        //global counters
                        int incomeCounter = 623;//must be 1 more than Income count
                        int HHMCounter = 1218; //must be 1 more than Household Members count
                        int busCounter = 69; //1 more than business
                        int crimeCounter = 107; //1 more than crime
                        int educationCounter = 397; //1 more than education
                        int empCounter = 391; //1 more than employment
                        int HHBCounter = 9; //1 more than householdbusiness
                        int HHICounter = 2361; //1 more than household items
                        int expensesCounter = 1350; //1 more than expenses
                        int healthConditionCounter = 552;
                        int leases = 53;
                        int grazing = 19;
                        int livestock = 146;
                        int trees = 181;
                        int vegetablesCount = 2985;
                        int skillsTrainingCount = 19;
                        int socialActivityCounter = 3490;
                        int socialNeighbours = 2507;
                        int socialServicesCounter = 4216;
                        int clinicCounter = 527;
                        int socialOrganisations = 357;
                        foreach (Respons r in responses)
                        {
                            responseNumber++;
                            responseCount++;
                            Console.WriteLine("*******************************************************");
                            Console.WriteLine("RESPONSE " + r.ID.ToString() + " -------------> Num: " + responseNumber + " Count:" + responseCount);
                            Console.WriteLine("*******************************************************");
                            //get the audited response data ordered
                            var ar = entity.GetAuditedResponse(r.ID).ToList();
                            if (ar == null || ar.Count == 0)
                            {
                                Console.WriteLine("No response skipping!!!!!!");
                                responseNumber--;
                                continue;
                            }

                            arNumber = 0;
                            Console.WriteLine("Processing the Audited Response");
                            Console.WriteLine("got " + ar.Count + " key values");

                            //create the command
                            OleDbCommand cmd = conn.CreateCommand();
                            MainTable mt = new MainTable();
                            mt.HouseholdID = responseNumber;
                            mt.businesDevCentreServices = false; //zeeba not in surveya
                            mt.DingletonHH = true; //zeeba not in surveya
                            mt.Survey_Name = "OCP";

                            List <Business> businesses = new List<Business>();
                            Business b = null;
                            

                            List<Crime> crimes = new List<Crime>();
                            Crime c = null;
                           
                            List<Education> educations = new List<Education>();
                            Education edu = null;
                            

                            List<Employment> employments = new List<Employment>();
                            Employment emp = null;
                            
                            List<Household_Business> houseHoldBusinesses = new List<Household_Business>();
                            Household_Business householdBusiness = null;
                            
                            List<Household_Items> houseHoldItems = new List<Household_Items>();
                            Household_Items houseHoldItem = null;
                            
                            List<Household_Members> houseHoldMembers = new List<Household_Members>();
                            Household_Members houseHoldMember = null;
                            
                            List<Expenses> expenses = new List<Expenses>();
                            Expenses expense = null;
                            

                            List<Income> incomes = new List<Income>();
                            Income income = null;

                            List<Health_Conditions> hConditions = new List<Health_Conditions>();
                            Health_Conditions hCondition = null;

                            List<Housing_Lease> hLeases = new List<Housing_Lease>();
                            Housing_Lease hLease = null;

                            List<Livelihood_Grazing> lGrazings = new List<Livelihood_Grazing>();
                            Livelihood_Grazing lGrazing = null;

                            List<Livelihood_Livestock> lLivestocks = new List<Livelihood_Livestock>();
                            Livelihood_Livestock lLivestock = null;

                            List<Livelihood_Trees> lTrees = new List<Livelihood_Trees>();
                            Livelihood_Trees lTree = null;

                            List<Livelihood_Vegetables> lVegs = new List<Livelihood_Vegetables>();
                            Livelihood_Vegetables lVeg = null;

                            List<Skills_Training> sTrainings = new List<Skills_Training>();
                            Skills_Training sTraining = null;

                            List<Social_Networks_Activities> snActivities = new List<Social_Networks_Activities>();
                            Social_Networks_Activities snActivity = null;

                            List<Social_Networks_Neighbours> snNeighbours = new List<Social_Networks_Neighbours>();
                            Social_Networks_Neighbours snNeighbour = null;

                            List<Social_Services> sServices = new List<Social_Services>();
                            Social_Services sService = null;

                            List<Health_Clinics> hClinics = new List<Health_Clinics>();
                            Health_Clinics hClinic = null;

                            Housing housing = new Housing();
                            housing.Housing_ID = responseNumber;
                            housing.Household_ID = mt.HouseholdID;
                            int housingCounter = responseNumber;

                            Resettlement_Experience ressettlment = new Resettlement_Experience();
                            ressettlment.Resettlement_ID = responseNumber;
                            ressettlment.Household_ID = mt.HouseholdID;
                            int reCounter = responseNumber;

                            /*
                            Householding_Structures_Fittings hFittings = new Householding_Structures_Fittings();
                            hFittings.Fitting_ID = responseNumber;
                            hFittings.Household_ID = mt.HouseholdID;
                            int hFittingsCounter = responseNumber;
                            */

                            List<Social_Organisations> sOrganisations = new List<Social_Organisations>();
                            Social_Organisations sOrganisation = null;

                            string currentRow = "";
                            ModeTypes mode = ModeTypes.Business;
                            bool modeSaved = false;
                            foreach (GetAuditedResponse_Result result in ar)
                            {
                                arNumber++;

                                Console.WriteLine("On AR " + result.ID.ToString() + "----------->" + arNumber);

                                if (result.QuestionRowID.ToString() != currentRow && currentRow != "")
                                {
                                    switch (mode)
                                    {
                                        case ModeTypes.Business:
                                            if (!String.IsNullOrWhiteSpace(b.Business_Name))
                                            {
                                                businesses.Add(b);
                                                busCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Crime:
                                            if (!String.IsNullOrWhiteSpace(c.CrimeString))
                                            {
                                                crimes.Add(c);
                                                crimeCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Education:
                                            if (!String.IsNullOrWhiteSpace(edu.Full_Name))
                                            {
                                                educations.Add(edu);
                                                educationCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Employment:
                                            if (!String.IsNullOrWhiteSpace(emp.Full_Name))
                                            {
                                                employments.Add(emp);
                                                empCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseholdBusiness:
                                            if (!String.IsNullOrWhiteSpace(householdBusiness.Business_Type))
                                            {
                                                houseHoldBusinesses.Add(householdBusiness);
                                                HHBCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseHoldItems:
                                            if (!String.IsNullOrWhiteSpace(houseHoldItem.Household_Item))
                                            {
                                                houseHoldItems.Add(houseHoldItem);
                                                HHICounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseholdMembers:
                                            if (!String.IsNullOrWhiteSpace(houseHoldMember.Full_Name))
                                            {
                                                houseHoldMembers.Add(houseHoldMember);
                                                HHMCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Expenses:
                                            if (!String.IsNullOrWhiteSpace(expense.Expenditure_Sources))
                                            {
                                                expenses.Add(expense);
                                                expensesCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Income:
                                            if (!String.IsNullOrWhiteSpace(income.Income_Sources))
                                            {
                                                incomes.Add(income);
                                                incomeCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HealthConditions:
                                            if (hCondition.No_HH_members_diagnosed != 0)
                                            {
                                                hConditions.Add(hCondition);
                                                healthConditionCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseLease:
                                            if (!String.IsNullOrWhiteSpace(hLease.Full_Name))
                                            {
                                                hLeases.Add(hLease);
                                                leases++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.LivelyhoodGrazing:
                                            if (!String.IsNullOrWhiteSpace(lGrazing.Type))
                                            {
                                                lGrazings.Add(lGrazing);
                                                grazing++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Livestock:
                                            if (!String.IsNullOrWhiteSpace(lLivestock.Type))
                                            {
                                                lLivestocks.Add(lLivestock);
                                                livestock++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Trees:
                                            if (!String.IsNullOrWhiteSpace(lTree.Type))
                                            {
                                                lTrees.Add(lTree);
                                                trees++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.LivelyhoodVegetables:
                                            if (!String.IsNullOrWhiteSpace(lVeg.Type))
                                            {
                                                lVegs.Add(lVeg);
                                                vegetablesCount++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SkillsTraining:
                                            if (!String.IsNullOrWhiteSpace(sTraining.Full_Name))
                                            {
                                                sTrainings.Add(sTraining);
                                                skillsTrainingCount++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialNetworkActivity:
                                            if (!String.IsNullOrWhiteSpace(snActivity.Social_Activities))
                                            {
                                                snActivities.Add(snActivity);
                                                socialActivityCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialNetworkNeighbours:
                                            if (!String.IsNullOrWhiteSpace(snNeighbour.ask_for_help))
                                            {
                                                snNeighbours.Add(snNeighbour);
                                                socialNeighbours++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialServices:
                                            if (!String.IsNullOrWhiteSpace(sService.Social_Services_Amenities))
                                            {
                                                sServices.Add(sService);
                                                socialServicesCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HealthClinics:
                                            if (!String.IsNullOrWhiteSpace(hClinic.Clinic))
                                            {
                                                hClinics.Add(hClinic);
                                                clinicCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialOrganisation:
                                            if (sOrganisation.Dingleton || sOrganisation.Siyathemba)
                                            {
                                                sOrganisations.Add(sOrganisation);
                                                socialOrganisations++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                    }
                                }

                                #region MainTable
                                //Interviewer Name: "DE4D51CC-ADE7-4325-9361-29E341F680E1"
                                if (result.ResponseValueQuestionID.ToString().ToUpper() == "7E25857D-157F-4551-9F91-4BFF4AAD700D")
                                {
                                    mt.InterviewerName = result.ResponseValue;
                                }
                                //Household Address : "62904ABD-3CBE-4C2C-9A8F-735EDBBE6E21"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "A4B1A98B-0144-49FF-B9D7-75D1D3E914A6")
                                {
                                    mt.HouseholdAddress = result.ResponseValue;
                                }
                                //Stand Number : "B54E0A58-2E18-4FFA-B0E3-85FBE41632FD"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "0D59FE59-1050-465F-A630-090604D84F0B")
                                {
                                    mt.StandNumber = result.ResponseValue;
                                }
                                //Interview Date : "4D253BEA-EF9C-473A-9043-C6FE6B6E41F3"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "2FEE8D9D-FD5F-4955-9B52-F30EF30D7086")
                                {
                                    DateTime IntDate = DateTime.Today;
                                    DateTime.TryParse(result.ResponseValue, out IntDate);
                                    mt.InterviewDate = IntDate;
                                }
                                //GPS Coordinates : "E47CFA17-BB2A-49D4-B330-FADA85AA8CB1"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "E774918B-CA1D-4394-906B-482A7D3918A2")
                                {
                                    mt.GPSCoord = result.ResponseValue;
                                }
                                //Signature of Respondent: "CBAD4DBD-D688-474E-BDBE-02941224544C" - !isNull(...)
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "E039C56D-9180-4ABF-957A-D0736770154B")
                                {
                                    mt.signature = !String.IsNullOrWhiteSpace(result.ResponseValue);
                                }
                                //Photo of Respondent: "9E21F29A-E324-4567-9DCA-695FBB50400D" - !isNull(...)
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "92E73757-F7E7-4C05-BC64-0D52C9AE5858")
                                {
                                    mt.photoRespondent = !String.IsNullOrWhiteSpace(result.ResponseValue);
                                }
                                //Photo of Stand: "6A1C4054-AA7E-4327-8114-2AA95C1FBF5C" - !isNull(...)
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "95FC02A5-2DC4-43B8-A5E4-ACC9F1725D11")
                                {
                                    mt.photoOfStand = !String.IsNullOrWhiteSpace(result.ResponseValue);
                                }
                                //Photos of Outbuildings: "08C18C9C-EFC0-46DC-9CCD-1F79D3598E06" - !isNull(...)
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "4F832107-B1C0-4FF4-828E-E8345640736A")
                                {
                                    mt.photosOfOutbuildings = !String.IsNullOrWhiteSpace(result.ResponseValue);
                                }
                                //Checked by supervisor: "C680D138-37F9-4A42-84F9-59157F44FA7A"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "3A4A2276-F69E-45FA-96A3-15664FD545C5")
                                {
                                    mt.checkedBySupervisor = ConvertFromYes(result.ResponseValue);
                                }
                                //Interviewee Full Name: "4C3A20DA-0280-4926-8C2C-B6F967B43AE0" + "7FEEF084-328E-456E-9F88-1A322A22DEF0" + "FA97AF05-D19C-4295-BE41-D9828EBBD5D2"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "1D9144CE-8889-4864-83B1-72394855C140")
                                {
                                    mt.intervieweeFullName = result.ResponseValue + " ";
                                }
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "603361E0-729B-4D2E-B063-9EF91C8EA30D")
                                {
                                    mt.intervieweeFullName = result.ResponseValue + " ";
                                }
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "7FE62529-6665-4891-A6FA-D204BC553139")
                                {
                                    mt.intervieweeFullName = result.ResponseValue + " ";
                                }
                                //Own house : "A99B4960-0CE5-4DD4-993E-7A04C930F0E0"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "B3C03095-F583-407F-98D9-907325317B46")
                                {
                                    mt.ownHouse = ConvertFromYes(result.ResponseValue);
                                }
                                //Owner Name : "054CBBEE-B2A3-4405-8D5F-0144808E5AC1"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "9F4625E3-D15B-4126-9008-B3B543A9431F")
                                {
                                    mt.ownerName = result.ResponseValue;
                                }
                                //Owner ID : "95315201-B52F-4B8E-A897-5F6D9536D73F"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "6EFD416E-1349-4CB9-9624-A728348E92B8")
                                {
                                    mt.ownerID = result.ResponseValue;
                                }
                                //Owner Tel Number: "52642146-8D3D-4766-8E08-780FA98FFEB4"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "1BCB7186-9E25-4689-8B63-00A0A7896759")
                                {
                                    mt.ownerTel = result.ResponseValue;
                                }
                                //3_1 No HH members on property : "CD9724C6-FA13-4E4E-B667-63EC8FC2E20B" OR COUNT ("0ACB39FE-60A4-4B26-AAA2-F501805A3D1C")
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "21ECFBE3-31AF-4514-A29A-CD739DBDD6EC")
                                {
                                    mt.noHHMembersonProp = GetValidInt(result.ResponseValue); //zeeba not sure if this number is accurate based on table fill or number specified
                                }
                                //7_2 HH members employed Tshipi : COUNT("B81BE883-500E-485F-98C9-E362B77FF407")
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "B81BE883-500E-485F-98C9-E362B77FF407")
                                {
                                    mt.hhMembersemployedTshipi = false; //zeeba not sure what to put here
                                }
                                //8_1 HH members own business : COUNT("EA94B641-995E-4BC7-B69A-73CB7C265BEB")
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "EA94B641-995E-4BC7-B69A-73CB7C265BEB")
                                {
                                    mt.hhMembersOwnBusiness = false; //zeeba require further check here
                                }
                                //9_1 Zimele Hub services : "FC8AB199-79B3-41C3-9777-43049DCE2458"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "B78EAD9B-6CE4-4C73-AE26-FAF0E2B9FFEA")
                                {
                                    mt.zimeleHubServices = ConvertFromYes(result.ResponseValue);
                                }
                                //9_1 Business Dev Centre services : NOT ON SURVEYA zeeba
                                /*else if (result.ResponseValueQuestionID.ToString().ToUpper() == "62904ABD-3CBE-4C2C-9A8F-735EDBBE6E21")
                                {
                                    mt.InterviewerName = result.ResponseValue;
                                }*/
                                //9_2 Business plan submitted : "D27DA371-A998-459F-84C0-91CE40F6B855"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "81FD4633-07D5-44E6-986C-853D777303EC")
                                {
                                    mt.businessPlanSubmitted = ConvertFromYes(result.ResponseValue);
                                }
                                //9_3 Business loan granted : "12846BB3-C81A-467B-B2FE-56DA8BC178D3"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "5AC9C92E-2AFE-4078-AA6F-C68534BB9C11")
                                {
                                    mt.businessLoanGranted = ConvertFromYes(result.ResponseValue);
                                }
                                //10_1 Fruit Trees : EITHER "055B58D4-127E-4C6B-8758-C4828D5B1BD2" OR COUNT("BD84ED01-DCC4-49A3-A2B8-773CDE24A90A")
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "A4AB19D6-9F85-4F7F-A259-97EF144AACC0")
                                {
                                    mt.fruitTrees = ConvertFromYes(result.ResponseValue); //zeeba
                                }
                                //12_1 Pets or Livestock : EITHER "41A6E075-323D-4E09-B964-29A643E691F8" OR COUNT("C35D6827-5464-4BC1-B5C9-38EBF79A1CAD")
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "6EEBE0E9-B498-4DD3-B5B9-8FA6C7852549")
                                {
                                    mt.petsOrLivestock = ConvertFromYes(result.ResponseValue);
                                }
                                //12_3 Livestock on Grazing land : "EDBB642E-7FF1-4D58-824B-67615452295F"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "663324B3-AE36-42DB-A194-CA031B4B966D")
                                {
                                    mt.liveStockOnGrazingLand = ConvertFromYes(result.ResponseValue);
                                }
                                //14_1 Same neighbours : "24575C72-6188-450E-BBCF-C78A53F41DBC"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "8A69C265-EFE8-49CA-9D15-65660A74C40B")
                                {
                                    mt.sameNeighbours = ConvertFromYes(result.ResponseValue);
                                }
                                //14_4 Accurate Statement : "1ABAE080-269F-49F4-8341-6269948FE679"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "303D72E6-80C0-42D0-87B4-5C94FBEC001D")
                                {
                                    mt.AccurateStatement = result.ResponseValue;
                                }
                                //15_1 Safer in which settlement : "615AA252-F1DB-408A-8599-3D9D5D155EA1"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "D2C75DD4-FC1B-4193-BB34-E38AB3F44667")
                                {
                                    mt.saferInWhichSettlement = result.ResponseValue;
                                }
                                //15_2 Crime Victim : "EB5F024E-350A-43E6-9037-2A1DDC35EA71"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "7961EE41-E7F5-4A4A-999C-8BDD035F7132")
                                {
                                    mt.crimeVictim = ConvertFromYes(result.ResponseValue);
                                }
                                //15_4 Drug abuse statements : "1ABAE080-269F-49F4-8341-6269948FE679"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "64BC4E66-634B-494F-8666-72E8312DA00A")
                                {
                                    mt.drugAbuseStatements = result.ResponseValue;
                                }
                                //15_5 Drug abuse increase reasons : "AED670B5-FCE1-40B1-ACD3-6FA39AA4B455"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "D8491D80-68D8-45CB-9167-77C84D2BF7EC")
                                {
                                    mt.drugAbuseIncreaseReasons = result.ResponseValue;
                                }
                                //17_3 Used the Clinic : "C42E45C6-8F8B-4647-8AB1-363C32955B61"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "C6087A69-2DAD-47B1-8E58-97E7512CAFB9")
                                {
                                    mt.usedTheClinic = ConvertFromYes(result.ResponseValue);
                                }
                                //17_4 Clinic Statement : "9C2147F0-8ECE-4EB4-85F9-35E064B6BAA5"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "544F61C6-4F8A-4955-B7BF-A39E64C57350")
                                {
                                    mt.clinicStatement = result.ResponseValue;
                                }
                                //17_5 HH Births : "9E84135B-8A22-4F91-A948-AEAFAF00CE5D"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "B165DBC7-D8B8-4C58-AD64-CDD88B0B472A")
                                {
                                    mt.hhBirths = ConvertFromYes(result.ResponseValue);
                                }
                                //17_6 HH Deaths : "AAD644B5-FD00-4ACD-B643-0C3B272B73BD"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "D84E40DF-F2D4-4FA2-9080-2294020AC6B4")
                                {
                                    mt.hhDeaths = ConvertFromYes(result.ResponseValue);
                                }
                                //18_2 Income Changed : "97682AFA-C533-4A43-B747-92DADB7D1B0D"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "22D3C6AC-93A6-4F0C-A1E5-FDF4D0BFF2B3")
                                {
                                    mt.incomeChanged = ConvertFromYes(result.ResponseValue);
                                }
                                //18_3 If Yes How Income changed : "F0AF3CF4-8CF5-4028-AD49-5C24DE26D502"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "C82C06EA-0130-45C1-B764-C9AD9C12EDDF")
                                {
                                    mt.howIncomeChanged = result.ResponseValue;
                                }
                                //19_1 Reduce Replacement property : "0AAC1BAE-9FEC-416E-B22D-354E0FCA54DE"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "0AAC1BAE-9FEC-416E-B22D-354E0FCA54DE")
                                {
                                    mt.reduceReplacementProperty = ConvertFromYes(result.ResponseValue);
                                }
                                //19_2 Property Changes : "11085C27-10B7-4637-A51B-79472BF1AD1A"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "11085C27-10B7-4637-A51B-79472BF1AD1A")
                                {
                                    mt.propertyChanges = ConvertFromYes(result.ResponseValue);
                                }
                                //20_1 Satisfaction Level : "25C74BC6-17BE-48D3-B1FF-2357750AA8B6"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "25C74BC6-17BE-48D3-B1FF-2357750AA8B6")
                                {
                                    mt.satisfactionLevel = result.ResponseValue;
                                }
                                //20_3 HH better off in Siyathemba : "C2B3885A-EC87-4E8E-AED6-90659A1AAEC7"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "A9EEF350-0BEF-4DFE-B845-C8891F26F496")
                                {
                                    mt.hhBetterOffInSiyathemba = result.ResponseValue;
                                }
                                //20_4 HH worse off in Siyathemba : "9EC09FDE-C3FF-4218-B55E-0B4E3912FCE3"
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "E450D2C8-AB8B-438B-A776-2EAB32DC5029")
                                {
                                    mt.hhWorseOffInSiyathemba = result.ResponseValue;
                                }
                                //Dingleton HH : zeeba do not have from surveya
                                /*else if (result.ResponseValueQuestionID.ToString().ToUpper() == "62904ABD-3CBE-4C2C-9A8F-735EDBBE6E21")
                                {
                                    mt.InterviewerName = result.ResponseValue;
                                }*/
                                #endregion

                                #region Business

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Business Details")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        b = new Business();
                                        b.Household_ID = mt.HouseholdID;
                                        b.Business_ID = busCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.Business;
                                        modeSaved = false;
                                    }

                                    //Business Name : "EA94B641-995E-4BC7-B69A-73CB7C265BEB"
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "22B35027-2ECE-4546-84B5-0CA4A9D09FDC")
                                    {
                                        b.Business_Name = result.ResponseValue;
                                    }
                                    //Type of Business: "355D076E-75AA-4645-8AEF-F9FED6404F29"
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "6CE9F034-2FFB-45C0-A0CA-C9B7EA5BE6EC")
                                    {
                                        b.Type_of_Business = result.ResponseValue;
                                    }
                                    //Submitted to offices: "39D85F12-E736-4A2B-836E-6A1DF597F31E"
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "BA22C8C2-FAAA-4B78-95AC-3457ED76798D")
                                    {
                                        b.Submitted_to_offices = ConvertFromYes(result.ResponseValue);
                                    }
                                }

                                #endregion

                                #region Crime

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Nature of Crime")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        c = new Crime();
                                        c.Household_ID = mt.HouseholdID;
                                        c.Crime_ID = crimeCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.Crime;
                                        modeSaved = false;
                                    }

                                    //Victim Of Crime : "6093D009-BEE7-41D4-A9E3-69057ED099A3"
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "1C4B0CDC-50C2-4F86-B8D8-A7A68AF3BEA7")
                                    {
                                        if (ConvertFromYes(result.ResponseValue))
                                        {
                                            c.CrimeString = result.RowName;
                                        }
                                    }
                                    //Incident Reported: "61EB1BAC-71EF-44AB-AC36-E0310C4113DB"
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "F7B1F77F-44A4-4576-B362-FB513877DC06")
                                    {
                                        c.Incident_reported = ConvertFromYes(result.ResponseValue);
                                    }
                                    //Submitted to offices: "39D85F12-E736-4A2B-836E-6A1DF597F31E"
                                    //else if (result.ResponseValueQuestionID.ToString().ToUpper() == "39D85F12-E736-4A2B-836E-6A1DF597F31E")
                                    //{
                                    //    b.Submitted_to_offices = ConvertFromYes(result.ResponseValue);
                                    //}
                                }

                                #endregion

                                #region Education

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Education: Household members")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        edu = new Education();
                                        edu.Household_ID = mt.HouseholdID;
                                        edu.Education_ID = educationCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.Education;
                                        modeSaved = false;
                                    }
                                    //Full Name    8480CC88-7043-4EBC-AA10-96EBC37AB5EB
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "00A1BE73-6F9A-405A-897A-F1189D79EE6B")
                                    {
                                        edu.Full_Name = result.ResponseValue;
                                    }
                                    //School Name    98C34860-5BD5-44AF-A828-B20B227D8CE3
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "347A52ED-C2C9-4E0B-814D-B0F3F34D6F73")
                                    {
                                        edu.School_Name = result.ResponseValue;
                                    }
                                    //Location    940D4BF2-CD24-4EEB-AE02-359AC406DF19
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "FD11FF11-81D4-467F-8DE7-D4C1CB2E5946")
                                    {
                                        edu.Location = result.ResponseValue;
                                    }
                                    //Grade (coding sheet)    897DB04E-0657-43B8-B75A-61A50CABE998
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "C67E8E00-5958-4D58-A451-D8B181BD3DBE")
                                    {
                                        edu.Grade = result.ResponseValue;
                                    }
                                    //Mode of Transport (coding sheet)    950241B3-C2F4-418E-9B32-FB5A9FD3DD1C
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "F9F04B0A-A9BB-4113-AF64-2B15190FED98")
                                    {
                                        edu.Mode_of_Transport = result.ResponseValue;
                                    }

                                }

                                #endregion

                                #region Employment

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Employment: Household Members")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        emp = new Employment();
                                        emp.Household_ID = mt.HouseholdID;
                                        emp.Employment_ID = empCounter;
                                        emp.Household_Member_ID = 0;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.Employment;
                                        modeSaved = false;
                                    }

                                    //Full Name    B81BE883-500E-485F-98C9-E362B77FF407
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "15045FF0-C2EB-48BB-A4D5-42A14FB72463")
                                    {
                                        emp.Full_Name = result.ResponseValue;
                                    }
                                    //Occupation Status (coding sheet)    556D0ABB-6778-4CE2-9BB1-EA07247AD0F9
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "50050287-696F-42C6-A89F-2615C1356844")
                                    {
                                        emp.Occupation = result.ResponseValue;
                                    }
                                    //Employer    4FCE8F70-056E-47BB-8EDB-C1A82F500D4E
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "2D0A6422-4D30-48E0-B102-ED35DF5C428D")
                                    {
                                        emp.Employer = result.ResponseValue;
                                    }
                                    //Location    38A95E92-D022-4ADE-8460-5BF57C4FCF9E
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "7617089F-8A88-4951-BE1C-DA1F8A07811D")
                                    {
                                        emp.Location = result.ResponseValue;
                                    }
                                    //Mode of Transport (coding sheet)    33B6C400-4B06-4D57-9A52-83DC6134D518
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "5A235F10-67F1-4FAD-8D2A-062172C82C1C")
                                    {
                                        emp.Transport = result.ResponseValue;
                                    }

                                }

                                #endregion

                                //#region HouseHoldBusiness

                                //if (result.GroupType.ToLower() == "table" && result.GroupName == "Business use")
                                //{
                                //    if (result.QuestionRowID.ToString() != currentRow)
                                //    {
                                //        householdBusiness = new Household_Business();
                                //        householdBusiness.Household_ID = mt.HouseholdID;
                                //        householdBusiness.Business_ID = HHBCounter;
                                //        currentRow = result.QuestionRowID.ToString();
                                //        mode = ModeTypes.HouseholdBusiness;
                                //        modeSaved = false;
                                //    }

                                //    //BusinessType    343CE58D-EAB8-402F-A8B5-745CD1FCAC08
                                //    if (result.ResponseValueQuestionID.ToString().ToUpper() == "343CE58D-EAB8-402F-A8B5-745CD1FCAC08")
                                //    {
                                //        if (ConvertFromYes(result.ResponseValue))
                                //        {
                                //            householdBusiness.Business_Type = result.RowName;
                                //        }
                                //    }


                                //}

                                //#endregion

                                #region HouseHoldItems

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Household items in working condition")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        houseHoldItem = new Household_Items();
                                        houseHoldItem.Household_ID = mt.HouseholdID;
                                        houseHoldItem.HH_Items_ID = HHICounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.HouseHoldItems;
                                        modeSaved = false;
                                    }

                                    //Owned    2FDCBA24-9E23-4099-BA44-A481B672674B
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "03082707-6995-4BA1-8DF0-2022BE20D26E")
                                    {
                                        if (ConvertFromYes(result.ResponseValue))
                                        {
                                            houseHoldItem.Household_Item = result.RowName;
                                        }
                                    }
                                    //Number owned    4863999C-1DD7-44BD-850B-E8FB0509143F
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "6E038035-5669-4DBE-81F0-170FEF882C3C")
                                    {
                                        houseHoldItem.Number_of_Items = GetValidInt(result.ResponseValue);
                                    }

                                }

                                #endregion

                                #region HouseHoldMembers

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "HH Members: Details")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        houseHoldMember = new Household_Members();
                                        houseHoldMember.Household_ID = mt.HouseholdID;
                                        houseHoldMember.HH_Members_ID = HHMCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.HouseholdMembers;
                                        modeSaved = false;
                                    }

                                    //Full Name    0ACB39FE-60A4-4B26-AAA2-F501805A3D1C
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "F0D95614-9FEF-4286-9E3C-D1DF987FD335")
                                    {
                                        houseHoldMember.Full_Name = result.ResponseValue;
                                    }
                                    //Relation to HH    0040416D-273E-4EE4-A20D-BD878F6D0424
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "CFC711B5-BCC3-4224-928F-7BFD3AFECC67")
                                    {
                                        houseHoldMember.Relation_to_HH = result.ResponseValue;
                                    }
                                    //Gender    597EEE97-D4D5-4ADD-AAFA-2F421DD0C56B
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "95FFBCFC-1A01-4861-937B-7024F3C61372")
                                    {
                                        houseHoldMember.Sex = result.ResponseValue;
                                    }
                                    //Age    A7137C1C-85DF-4252-91B2-5D1386472A8B
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "95FFBCFC-1A01-4861-937B-7024F3C61372")
                                    {
                                        houseHoldMember.age = GetValidInt(result.ResponseValue);
                                    }
                                    //Residence Status (coding sheet)    AAD40103-3AB3-4B30-AA08-DD4D551010DE
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "05618EE4-4AC6-4AD5-A55E-E4E992A1B95D")
                                    {
                                        houseHoldMember.Residence_Status = result.ResponseValue;
                                    }
                                    //Education Status (Highest grade completed)    4DF2A596-3FB4-47E5-A46F-3D8073C8A047
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "B7292F57-CA2C-413C-945C-911CCB571515")
                                    {
                                        houseHoldMember.Education_Status = result.ResponseValue;
                                    }
                                    //Occupation (coding sheet)    498F3000-C96E-46D5-8708-ED0266F6495E
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "C886D167-E890-4DB7-9541-AF42732431F2")
                                    {
                                        houseHoldMember.Occupation = result.ResponseValue;
                                    }
                                    //Disability (coding sheet)    E6CF88B2-EDEF-449E-B00D-E0499F5765B9
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "15AB40FB-4014-4E1C-BDDF-DF704E561A79")
                                    {
                                        houseHoldMember.Disability = result.ResponseValue;
                                    }
                                }

                                #endregion

                                #region Expenses

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Expenses")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        expense = new Expenses();
                                        expense.Household_ID = mt.HouseholdID;
                                        expense.Expenses_ID = expensesCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.Expenses;
                                        modeSaved = false;
                                    }

                                    //ExpenseType    584FF1A2-4D1E-4B4A-9A8F-BDC0A240F318
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "8EB3BB1B-05D3-4C10-8314-69283547AD0F")
                                    {
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            expense.Expenditure_Sources = result.RowName;
                                            expense.Expense_Value = GetValidDouble(result.ResponseValue);
                                        }
                                    }


                                }

                                #endregion

                                #region Housing
                                //Rent Rooms: "08EFABA7-2031-4E78-8E20-CFF0A561EF2E"
                                if (result.ResponseValueQuestionID.ToString().ToUpper() == "DEBBEB5B-6EF7-4008-9184-EF1F08617E3A")
                                {
                                    housing.Rent_Rooms = ConvertFromYes(result.ResponseValue);
                                }
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "0C5F551A-1EC6-4B5A-8DFE-17B6E3F74F83")
                                {
                                    housing.If_Yes_how_many_tenants = GetValidInt(result.ResponseValue);
                                }
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "B51A7DF7-BC79-408A-BBF8-E0BA82A6C4AB")
                                {
                                    housing.Rental_earned_on_a_monthly_basis = GetValidDouble(result.ResponseValue);
                                }
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "FFEA0824-6B43-4D01-8C7A-50A06386921A")
                                {
                                    housing.Own_alternative_residence = ConvertFromYes(result.ResponseValue);
                                }
                                else if (result.ResponseValueQuestionID.ToString().ToUpper() == "74D1F58C-84CD-4F5B-A791-163427715025")
                                {
                                    housing.Location_of_alternative_residence = (result.ResponseValue);
                                }
                                #endregion

                                #region Incomes

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Income")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        income = new Income();
                                        income.Household_ID = mt.HouseholdID;
                                        income.Income_ID = incomeCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.Income;
                                        modeSaved = false;
                                    }

                                    //Income    75AC28E5-A83E-4AE5-9A44-DD85D55BBBAE
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "1E0CF205-28DF-469F-A97E-8978654C23BC")
                                    {
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            income.Income_Sources = result.RowName;
                                            income.Income_Value = GetValidDouble(result.ResponseValue);
                                        }
                                    }


                                }

                                #endregion

                                #region Resettlement Experience True / False [NO RESETTLEMENT FOR OCP]
                                if (result.GroupType.ToLower() == "table" && result.GroupName == "True or False")
                                {
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "B19369CB-DF86-4F04-8222-91C1CD8BFF4A")
                                    {
                                        //THESE ARE DRIVEN BY ROW ID!!!
                                        //Being relocated from Dingleton to Siyathemba was a stressful experience    D21432F9-5A8C-47FB-82F8-02362E05955C
                                        if (result.QuestionRowID.ToString().ToUpper() == "D21432F9-5A8C-47FB-82F8-02362E05955C")
                                        {
                                            ressettlment.Stressful_experience = result.ResponseValue;
                                        }
                                        //Being relocated from Dingleton to Siyathemba was an enjoyable experience    46B90B4E-AA33-4447-9108-E2064425D030
                                        else if (result.QuestionRowID.ToString().ToUpper() == "46B90B4E-AA33-4447-9108-E2064425D030")
                                        {
                                            ressettlment.Enjoyable_experience = result.ResponseValue;
                                        }
                                        //The living conditions in Siyathemba are better than in Dingleton    667F8C3B-C32D-4213-846C-E4BAF120A762
                                        else if (result.QuestionRowID.ToString().ToUpper() == "667F8C3B-C32D-4213-846C-E4BAF120A762")
                                        {
                                            ressettlment.Better_living_conditions = result.ResponseValue;
                                        }
                                        //Access to municipal services (i.e. water, lights and refuse removal) have improved    7BAAA94E-A0F4-4987-85CA-5AD087A97107
                                        else if (result.QuestionRowID.ToString().ToUpper() == "7BAAA94E-A0F4-4987-85CA-5AD087A97107")
                                        {
                                            ressettlment.Improved_service_access = result.ResponseValue;
                                        }
                                        //There is a sense of community among the resettled households in Siyathemba    5A082E93-4A87-48C6-B51C-013F58AFD6DE
                                        else if (result.QuestionRowID.ToString().ToUpper() == "5A082E93-4A87-48C6-B51C-013F58AFD6DE")
                                        {
                                            ressettlment.Sense_of_community = result.ResponseValue;
                                        }
                                        //I wish I could move back to Dingleton    196B2856-E727-4498-B5D3-4530FE48B5A2
                                        else if (result.QuestionRowID.ToString().ToUpper() == "196B2856-E727-4498-B5D3-4530FE48B5A2")
                                        {
                                            ressettlment.Move_back_to_Dingleton = result.ResponseValue;
                                        }
                                        //I feel a sense of belonging in Siyathemba    A533633F-5438-4599-ABD4-F7EED6DECF1D
                                        else if (result.QuestionRowID.ToString().ToUpper() == "A533633F-5438-4599-ABD4-F7EED6DECF1D")
                                        {
                                            ressettlment.Sense_of_belonging = result.ResponseValue;
                                        }
                                        //My life has changed for the better in Siyathemba    20631688-C214-40A1-A15B-AB14E866C9EC
                                        else if (result.QuestionRowID.ToString().ToUpper() == "20631688-C214-40A1-A15B-AB14E866C9EC")
                                        {
                                            ressettlment.Life_changed_for_better = result.ResponseValue;
                                        }
                                        //My Siyathemba garden is too small    86C27E6A-0482-4669-A64A-06EE2B0F7D72
                                        else if (result.QuestionRowID.ToString().ToUpper() == "86C27E6A-0482-4669-A64A-06EE2B0F7D72")
                                        {
                                            ressettlment.Garden_too_small = result.ResponseValue;
                                        }
                                        //The cost of living in Siyathemba is higher than it was in Dingleton    34A51169-E2AE-4DA3-A4A6-A9487F6C2897
                                        else if (result.QuestionRowID.ToString().ToUpper() == "34A51169-E2AE-4DA3-A4A6-A9487F6C2897")
                                        {
                                            ressettlment.Higher_cost_of_living = result.ResponseValue;
                                        }
                                        //Siyathemba is noisier than Dingleton (traffic, construction)    1C7E10CF-81AF-4D6C-8215-D26848D442E9
                                        else if (result.QuestionRowID.ToString().ToUpper() == "1C7E10CF-81AF-4D6C-8215-D26848D442E9")
                                        {
                                            ressettlment.Noisier = result.ResponseValue;
                                        }
                                        //My household is more vulnerable to crime in Siyathemba    33AABDF7-5A5C-466F-8D62-C77859C1260D
                                        else if (result.QuestionRowID.ToString().ToUpper() == "33AABDF7-5A5C-466F-8D62-C77859C1260D")
                                        {
                                            ressettlment.More_vulnerable_to_crime = result.ResponseValue;
                                        }
                                        //Drug and alcohol abuse is higher in Siyathemba than it was in Dingleton    C39F0316-092D-479F-8A18-55F1B928B877
                                        else if (result.QuestionRowID.ToString().ToUpper() == "C39F0316-092D-479F-8A18-55F1B928B877")
                                        {
                                            ressettlment.Higher_drug_alcohol_abuse = result.ResponseValue;
                                        }
                                        //I am satisfied with the quality of my replacement house in Siyathemba    A5790FBC-E3A5-48DC-B76A-595ADFD4FFFE
                                        else if (result.QuestionRowID.ToString().ToUpper() == "A5790FBC-E3A5-48DC-B76A-595ADFD4FFFE")
                                        {
                                            ressettlment.Happy_with_quality_of_house = result.ResponseValue;
                                        }
                                        //I am happy that I chose to relocate to Siyathemba    C75CB6CC-2FB6-4B71-8FF1-54F6CBFA7ED5
                                        else if (result.QuestionRowID.ToString().ToUpper() == "C75CB6CC-2FB6-4B71-8FF1-54F6CBFA7ED5")
                                        {
                                            ressettlment.Happy_I_relocated = result.ResponseValue;
                                        }

                                    }
                                }
                                #endregion


                                #region Health Conditions

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Medication Conditions")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        hCondition = new Health_Conditions();
                                        hCondition.Household_ID = mt.HouseholdID;
                                        hCondition.Health_ID = healthConditionCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.HealthConditions;
                                        modeSaved = false;
                                    }
                                    
                                    //HealthCondition   4FEFC9AC-82B1-4A3E-B0DD-BE3C56C3D052
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "F37C8B90-3B38-4406-ADA9-D4BC9901E5C5")
                                    {
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue) && result.ResponseValue.ToUpper() == "YES")
                                        {
                                            hCondition.Medical_Condition = result.RowName;
                                        }
                                    }
                                    //HealthCondition   D355229B-4EF2-4448-92C3-3D0DC9F124B1
                                    if (result.ResponseValueQuestionID.ToString().ToLower() == "c959a9da-48de-4ede-be56-7cb279197076")
                                    {
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            hCondition.No_HH_members_diagnosed = GetValidInt(result.ResponseValue);
                                        }
                                    }


                                }

                                #endregion

                                #region Householding_Structures_Fittings  [NOT IN SURVEY]
                                /*
                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Fixtures")
                                {
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "7D3D7A1A-565E-4A80-BEEF-11FCB89A6095")
                                    {



                                        //THESE ARE DRIVEN BY ROW ID!!!

                                        //public bool Solar_geyser;             // A45BAA36-F348-4FC5-BB4E-04DD6B0493BE  <- QuestionRowID
                                        if (result.QuestionRowID.ToString().ToUpper() == "A45BAA36-F348-4FC5-BB4E-04DD6B0493BE")
                                        {
                                            hFittings.Solar_geyser = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Plumbing;                  // FAC6FDA9-3EEF-4775-9CBA-D0CCB7AFA287  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "FAC6FDA9-3EEF-4775-9CBA-D0CCB7AFA287")
                                        {
                                            hFittings.Plumbing = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Kitchen_taps;            // 42D432E7-5962-4261-89A8-64433D00C995  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "42D432E7-5962-4261-89A8-64433D00C995")
                                        {
                                            hFittings.Kitchen_taps = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Bathroom_taps;        // 1AB339EC-D9AE-4B7A-B3FC-128A5A2CDB98  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "1AB339EC-D9AE-4B7A-B3FC-128A5A2CDB98")
                                        {
                                            hFittings.Bathroom_taps = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Electrical_stove;       // 042E9607-2B5C-41F3-B343-49C1940FDE2E  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "042E9607-2B5C-41F3-B343-49C1940FDE2E")
                                        {
                                            hFittings.Electrical_stove = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Electrical_wiring;      // E4AE075A-B8BA-4537-B6BE-ED5695A0B53D  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "E4AE075A-B8BA-4537-B6BE-ED5695A0B53D")
                                        {
                                            hFittings.Electrical_wiring = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Electricity_meter;     // 7D73E93F-399C-4298-8231-9803651FA3A1  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "7D73E93F-399C-4298-8231-9803651FA3A1")
                                        {
                                            hFittings.Electricity_meter = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Floor_tiles;                // B3C4EB71-7098-4E6F-83CA-B0649C9FB9BE  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "B3C4EB71-7098-4E6F-83CA-B0649C9FB9BE")
                                        {
                                            hFittings.Floor_tiles = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Doors;                       // 8FB41CB1-0A5F-405F-A813-528AE1893F03  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "8FB41CB1-0A5F-405F-A813-528AE1893F03")
                                        {
                                            hFittings.Doors = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Security_gates;        // CC10A277-C1F7-47A3-BB07-7178767B800F  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "CC10A277-C1F7-47A3-BB07-7178767B800F")
                                        {
                                            hFittings.Security_gates = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool JoJo_tank;                // 612EA8B4-3285-4229-9058-EB8F884BDAF4  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "612EA8B4-3285-4229-9058-EB8F884BDAF4")
                                        {
                                            hFittings.JoJo_tank = ConvertFromYes(result.ResponseValue);
                                        }
                                        //public bool Boundary_fence;     // D3B1A17F-7FD3-4E52-883A-4B09CDCB1178  <- QuestionRowID
                                        else if (result.QuestionRowID.ToString().ToUpper() == "D3B1A17F-7FD3-4E52-883A-4B09CDCB1178")
                                        {
                                            hFittings.Boundary_fence = ConvertFromYes(result.ResponseValue);
                                        }
                                    }
                                }*/

                                #endregion

                                #region Leases

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Tenants: Tenant Details")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        hLease = new Housing_Lease();
                                        hLease.Housing_ID = housing.Housing_ID;
                                        hLease.Lease_ID = leases;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.HouseLease;
                                        modeSaved = false;
                                    }

                                    //public String Full_Name;                                           // 4E9DE36B-75F7-49B9-8837-F6C4DC676434
                                    //public bool Formal_Rental_Agreement;                  // EC90E424-590A-49C3-9048-F50DE7C9BAC1
                                    //public decimal Amount;                                           // C260CD2E-61D0-4AFD-B629-697F86B96D35

                                    //public String Full_Name;                                           // 4E9DE36B-75F7-49B9-8837-F6C4DC676434
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "4E9DE36B-75F7-49B9-8837-F6C4DC676434")
                                    {
                                        hLease.Full_Name = result.ResponseValue;
                                    }
                                    //public bool Formal_Rental_Agreement;                  // EC90E424-590A-49C3-9048-F50DE7C9BAC1
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "EC90E424-590A-49C3-9048-F50DE7C9BAC1")
                                    {
                                        hLease.Formal_Rental_Agreement = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public decimal Amount;                                           // C260CD2E-61D0-4AFD-B629-697F86B96D35
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "C260CD2E-61D0-4AFD-B629-697F86B96D35")
                                    {
                                        hLease.Amount = GetValidDouble(result.ResponseValue);
                                    }

                                }

                                #endregion

                                #region LivelihoodGrazing and LivelihoodLivestock

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Details")
                                {
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "FF3B405A-1470-4ABD-8098-27A0B2673F2E")
                                    {
                                        if (result.QuestionRowID.ToString() != currentRow)
                                        {
                                            lGrazing = new Livelihood_Grazing();
                                            lGrazing.Household_ID = mt.HouseholdID;
                                            lGrazing.Grazing_ID = grazing;
                                            currentRow = result.QuestionRowID.ToString();
                                            mode = ModeTypes.LivelyhoodGrazing;
                                            modeSaved = false;
                                        }

                                        //Page="Livestock" GroupName="Details"   ResponseValueQuestionID="673F6FEA-438E-42AA-B2B2-EF97F2641A48"

                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            lGrazing.Type = result.RowName;
                                            lGrazing.Number = GetValidInt(result.ResponseValue);
                                            lGrazing.Specify_Other = "";
                                        }
                                    }
                                    //livelihood livestock
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "84FBBA6E-9092-4504-8129-AA22D40025CC")
                                    {
                                        if (result.QuestionRowID.ToString() != currentRow)
                                        {
                                            lLivestock = new Livelihood_Livestock();
                                            lLivestock.Household_ID = mt.HouseholdID;
                                            lLivestock.Livestock_ID = livestock;
                                            currentRow = result.QuestionRowID.ToString();
                                            mode = ModeTypes.Livestock;
                                            modeSaved = false;
                                        }

                                        //Page="Livestock" GroupName="Details"   ResponseValueQuestionID="673F6FEA-438E-42AA-B2B2-EF97F2641A48"

                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            lLivestock.Type = result.RowName;
                                            lLivestock.Number = GetValidInt(result.ResponseValue);
                                            lLivestock.Specify_Other = "";
                                        }
                                    }


                                }

                                #endregion

                                #region LivelihoodTrees

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Information on productive trees")
                                {
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "DB544BB0-33CB-4782-8D1E-957DFD64966C")
                                    {
                                        if (result.QuestionRowID.ToString() != currentRow)
                                        {
                                            lTree = new Livelihood_Trees();
                                            lTree.Household_ID = mt.HouseholdID;
                                            lTree.Trees_ID = trees;
                                            currentRow = result.QuestionRowID.ToString();
                                            mode = ModeTypes.Trees;
                                            modeSaved = false;
                                        }

                                        //Page="Livestock" GroupName="Details"   ResponseValueQuestionID="673F6FEA-438E-42AA-B2B2-EF97F2641A48"

                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            lTree.Type = result.RowName;
                                            lTree.Number = GetValidInt(result.ResponseValue);
                                            lTree.Specify_Other = "";
                                            lTree.Productive_Trees = 0;
                                            lTree.Use = "";
                                        }
                                    }

                                }

                                #endregion

                                #region LivelihoodVegetables

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Cultivation")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        lVeg = new Livelihood_Vegetables();
                                        lVeg.Household_ID = mt.HouseholdID;
                                        lVeg.Vegetable_ID = vegetablesCount;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.LivelyhoodVegetables;
                                        modeSaved = false;
                                        //store the type here as this row has many columns
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            lVeg.Type = result.RowName;
                                            lVeg.Specify_Other = "";
                                        }
                                    }

                                    //public bool Dingleton (Prior to move) Yes/No;                                    // 96A395D2-C883-4483-9D44-3AABFFCC2759
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "66CDD5CF-6264-4900-B885-DD6C163D6149")
                                    {
                                        lVeg.Dingleton = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public bool OCP (Now) Yes/No;                                 // 64FCB55F-5FCF-482D-B005-52408AE35B09
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "BEE4BBB6-6D38-409C-AE33-6156CD7C91B9")
                                    {
                                        lVeg.Siyathemba = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public string Specify_Other;                  // IF RowName=="Other (specify)" and ResponseValue!=null
                                }

                                #endregion

                                #region Skills Training

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Skills and Training: Household Members")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        sTraining = new Skills_Training();
                                        sTraining.Household_ID = mt.HouseholdID;
                                        sTraining.Skills_Training_ID = skillsTrainingCount;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.SkillsTraining;
                                        modeSaved = false;
                                    }
                                    /*
                                    Full Name	                A88120B2-959D-4BC7-B869-ACAC61010A34
                                    Training Programme	        5F97E5AE-F03C-4FA6-A471-8DF4A63D567D
                                    Start Date (month/year)	    D13102F0-2F20-4FFC-96BB-6CA8E403E676
                                    End Date (month/year)	    27101207-120F-457E-9B7F-88B97175B189
                                    Certification	            F09DE28F-CA3D-44D9-A047-B6A3D1728B1D

                                    */
                                    //public String Full_Name;                                           // C573A306-5A08-4643-8CBC-6273A45D86F9
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "A88120B2-959D-4BC7-B869-ACAC61010A34")
                                    {
                                        sTraining.Full_Name = (string.IsNullOrWhiteSpace(result.ResponseValue) || result.ResponseValue == "0") ? "" : result.ResponseValue;
                                    }
                                    //public String Training_Programme;                                           // 27A38A45-A435-4E2E-8F96-2ECFD04CD9A7
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "5F97E5AE-F03C-4FA6-A471-8DF4A63D567D")
                                    {
                                        sTraining.Training_Programme = result.ResponseValue;
                                    }
                                    //public DateTime Start_Date;                                           // 7CA0AA47-D81B-444E-A285-BBD044A97442
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "D13102F0-2F20-4FFC-96BB-6CA8E403E676")
                                    {
                                        DateTime theDate = DateTime.Today;
                                        DateTime.TryParse(result.ResponseValue, out theDate);
                                        sTraining.Start_Date = theDate;
                                    }
                                    //public DateTime End_Date;                                    // 4C7198AD-241F-4666-8426-38624A9F3947
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "27101207-120F-457E-9B7F-88B97175B189")
                                    {
                                        DateTime theDate = DateTime.Today;
                                        DateTime.TryParse(result.ResponseValue, out theDate);
                                        sTraining.End_Date = theDate;
                                    }
                                    //public bool Certification;                                  // F504FCC1-906B-48E9-A78F-2800CCD7B161
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "F09DE28F-CA3D-44D9-A047-B6A3D1728B1D")
                                    {
                                        sTraining.Certification = ConvertFromYes(result.ResponseValue);
                                    }

                                }

                                #endregion

                                #region Social Network Activities

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Community Involvement")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        snActivity = new Social_Networks_Activities();
                                        snActivity.Household_ID = mt.HouseholdID;
                                        snActivity.Activities_ID = socialActivityCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.SocialNetworkActivity;
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            snActivity.Social_Activities = result.RowName;
                                            snActivity.Social_Activities_Other = "";
                                        }
                                        modeSaved = false;
                                    }
                                    //public bool Dingleton;                                           // 94E19693-FF17-4AAA-BBE7-249CB90367EB
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "E0E5D700-8EF2-40C0-8ED1-610488B72810")
                                    {
                                        snActivity.Dingleton = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public bool Siyathemba;                                           // 714C8152-51DA-41B2-A273-CF6841BB55C8
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "16DBF1B0-9942-4BD2-882B-E4E0A0B5DE3D")
                                    {
                                        snActivity.Siyathemba = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public String Reason_for_change;                                  // 7C44BC08-1130-48E8-80BC-B1E4E135F4C0
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "A1ED8B74-4B59-40BE-8787-B1AFDA900E29")
                                    {
                                        snActivity.Reason_for_change = result.ResponseValue;
                                    }

                                }

                                #endregion

                                #region Socian Network Neighbours

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Community Support")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        snNeighbour = new Social_Networks_Neighbours();
                                        snNeighbour.Household_ID = mt.HouseholdID;
                                        snNeighbour.Neighbours_ID = socialNeighbours;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.SocialNetworkNeighbours;
                                        modeSaved = false;
                                        //store the type here as this row has many columns
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            snNeighbour.ask_for_help = result.RowName;
                                        }
                                    }

                                    //public bool Dingleton;                                    // 24146343-4527-4329-9C8B-FFCD9C0DE37D
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "F7AD1D15-CEC5-43FF-B70C-00870BCA767A")
                                    {
                                        snNeighbour.Dingleton = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public bool Siyathemba;                                 // 28EC571A-4BD8-4493-B4CA-AEC79D842CF8
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "3BA580F5-B5D1-4012-AE70-1F33A1B4076D")
                                    {
                                        snNeighbour.Siyathemba = ConvertFromYes(result.ResponseValue);
                                    }
                                }

                                #endregion

                                #region Social Services

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Dingleton vs Siyathemba")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        sService = new Social_Services();
                                        sService.Household_ID = mt.HouseholdID;
                                        sService.Social_Services_ID = socialServicesCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.SocialServices;
                                        modeSaved = false;
                                        //store the type here as this row has many columns
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            sService.Social_Services_Amenities = result.RowName;
                                            sService.Dingleton_Transport_Other = "";
                                            sService.Siyathemba_Transport_Other = "";
                                        }
                                    }
                                    /*
                                        Dingleton Mode of Transport	        5BC6DBC6-7EC2-45B5-82AF-A43D53029DEE
                                        Dingleton Travel Time (minutes)	    D9D03F21-076A-49AD-A620-A96885FD7833
                                        Dingleton Cost of travel (return)	6CC7BD54-B67C-4196-92BC-11B66879B68E
                                        OCP (Now) Mode of Transport	        7AAE33EC-64B4-49A4-A973-027D3DE0D9FC
                                        OCP (Now) Time of Travel (minutes)	D06A6DE4-4921-4D07-BECF-7F86A88372CE
                                        OCP (Now) Cost of Travel (return)	3DDF6E63-39C7-40E7-AEC3-CE0FB3F6F06D
                                    */

                                    //public String Dingleton_Transport;              //  7E9F179B-3FF2-4522-ADDE-1697FA3A6B46
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "5BC6DBC6-7EC2-45B5-82AF-A43D53029DEE")
                                    {
                                        sService.Dingleton_Transport = result.ResponseValue;
                                    }
                                    //public int Dingleton_Time;                     //  D73C4FDC-1B5B-4DA7-A3A4-55A21B0F930E
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "D9D03F21-076A-49AD-A620-A96885FD7833")
                                    {
                                        sService.Dingleton_Time = GetValidInt(result.ResponseValue);
                                    }
                                    //public double Dingleton_Cost;              //  F42ADFA7-B7E0-443F-9ACF-E56DD4CA7341
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "6CC7BD54-B67C-4196-92BC-11B66879B68E")
                                    {
                                        sService.Dingleton_Cost = GetValidDouble(result.ResponseValue);
                                    }
                                    //public String Siyathemba_Transport;              //  BAB85386-7849-4BB5-9058-FF52F5D2F292
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "7AAE33EC-64B4-49A4-A973-027D3DE0D9FC")
                                    {
                                        sService.Siyathemba_Transport = result.ResponseValue;
                                    }
                                    //public int Siyathemba_Time;                     // 37DF8C42-4326-4B7D-A033-2C481A8A6882
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "D06A6DE4-4921-4D07-BECF-7F86A88372CE")
                                    {
                                        sService.Siyathemba_Time = GetValidInt(result.ResponseValue);
                                    }
                                    //public double Siyathemba_Cost;              //  42AD8276-8CA3-40AE-B705-69145EF660C7
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "3DDF6E63-39C7-40E7-AEC3-CE0FB3F6F06D")
                                    {
                                        sService.Siyathemba_Cost = GetValidDouble(result.ResponseValue);
                                    }
                                }

                                #endregion

                                #region Health Clinic

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Clinic Visits")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        hClinic = new Health_Clinics();
                                        hClinic.Household_ID = mt.HouseholdID;
                                        hClinic.Clinic_ID = clinicCounter;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.HealthClinics;
                                        modeSaved = false;
                                        //store the type here as this row has many columns
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            hClinic.Clinic = result.RowName;
                                            hClinic.Other_Transport = "";
                                        }
                                    }
                                    /*
                                        Clinic visits       	E33C0F04-150E-4CC5-9AA2-9988016498E0
                                        Mode of Transport   	F7F7D823-6F14-4611-A78E-A2B6E3B1E906
                                        Travel time (minutes)	9D700508-6F32-4EF7-8171-73DC2EEE69CF
                                        */
                                    //public string Frequency_of_Visits;  //3D10A2B2-1B96-4B7B-8D7E-AC0E2F2D1248
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "E33C0F04-150E-4CC5-9AA2-9988016498E0")
                                    {
                                        hClinic.Frequency_of_Visits = result.ResponseValue;
                                    }
                                    //public string Mode_of_Transport;  //912D4563-1609-4AE4-BA3C-535052E17741
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "F7F7D823-6F14-4611-A78E-A2B6E3B1E906")
                                    {
                                        hClinic.Mode_of_Transport = result.ResponseValue;
                                    }
                                    //public int Distance;                         // 28B5C594-1CD2-4CE9-A0A5-A64790702585   but it says `Travel time (minutes)`
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "9D700508-6F32-4EF7-8171-73DC2EEE69CF")
                                    {
                                        hClinic.Distance = GetValidInt(result.ResponseValue);
                                    }

                                }

                                #endregion

                                #region SocialOrganisations

                                if (result.GroupType.ToLower() == "table" && result.GroupName == "Assistance Received")
                                {
                                    if (result.QuestionRowID.ToString() != currentRow)
                                    {
                                        sOrganisation = new Social_Organisations();
                                        sOrganisation.Household_ID = mt.HouseholdID;
                                        sOrganisation.Organisation_ID = socialOrganisations;
                                        currentRow = result.QuestionRowID.ToString();
                                        mode = ModeTypes.SocialOrganisation;
                                        modeSaved = false;
                                        //store the type here as this row has many columns
                                        if (!String.IsNullOrWhiteSpace(result.ResponseValue))
                                        {
                                            sOrganisation.Organisation = result.RowName;
                                        }
                                    }

                                    //public bool Dingleton;                                    // B8294638-ED7D-485D-AA01-936CBFF8753D
                                    if (result.ResponseValueQuestionID.ToString().ToUpper() == "C7840B4B-E9B8-4C99-94DF-E52A4466ABE5")
                                    {
                                        sOrganisation.Dingleton = ConvertFromYes(result.ResponseValue);
                                    }
                                    //public bool Siyathemba;                                 // FFB96448-E2F9-4EB9-BECF-48133D31E747
                                    else if (result.ResponseValueQuestionID.ToString().ToUpper() == "FDF4F241-77A5-471C-A9D8-0A3D09771D77")
                                    {
                                        sOrganisation.Siyathemba = ConvertFromYes(result.ResponseValue);
                                    }
                                }

                                #endregion

                                #region SWITCH MODES SAVER
                                if (!modeSaved && currentRow != "" && ar.Count == arNumber)
                                {
                                    switch (mode)
                                    {
                                        case ModeTypes.Business:
                                            if (!String.IsNullOrWhiteSpace(b.Business_Name))
                                            {
                                                businesses.Add(b);
                                                busCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Crime:
                                            if (!String.IsNullOrWhiteSpace(c.CrimeString))
                                            {
                                                crimes.Add(c);
                                                crimeCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Education:
                                            if (!String.IsNullOrWhiteSpace(edu.Full_Name))
                                            {
                                                educations.Add(edu);
                                                educationCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Employment:
                                            if (!String.IsNullOrWhiteSpace(emp.Full_Name))
                                            {
                                                employments.Add(emp);
                                                empCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseholdBusiness:
                                            if (!String.IsNullOrWhiteSpace(householdBusiness.Business_Type))
                                            {
                                                houseHoldBusinesses.Add(householdBusiness);
                                                HHBCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseHoldItems:
                                            if (!String.IsNullOrWhiteSpace(houseHoldItem.Household_Item))
                                            {
                                                houseHoldItems.Add(houseHoldItem);
                                                HHICounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseholdMembers:
                                            if (!String.IsNullOrWhiteSpace(houseHoldMember.Full_Name))
                                            {
                                                houseHoldMembers.Add(houseHoldMember);
                                                HHMCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Expenses:
                                            if (!String.IsNullOrWhiteSpace(expense.Expenditure_Sources))
                                            {
                                                expenses.Add(expense);
                                                expensesCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Income:
                                            if (!String.IsNullOrWhiteSpace(income.Income_Sources))
                                            {
                                                incomes.Add(income);
                                                incomeCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HealthConditions:
                                            if (!String.IsNullOrWhiteSpace(hCondition.Medical_Condition))
                                            {
                                                hConditions.Add(hCondition);
                                                healthConditionCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HouseLease:
                                            if (!String.IsNullOrWhiteSpace(hLease.Full_Name))
                                            {
                                                hLeases.Add(hLease);
                                                leases++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.LivelyhoodGrazing:
                                            if (!String.IsNullOrWhiteSpace(lGrazing.Type))
                                            {
                                                lGrazings.Add(lGrazing);
                                                grazing++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Livestock:
                                            if (!String.IsNullOrWhiteSpace(lLivestock.Type))
                                            {
                                                lLivestocks.Add(lLivestock);
                                                livestock++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.Trees:
                                            if (!String.IsNullOrWhiteSpace(lTree.Type))
                                            {
                                                lTrees.Add(lTree);
                                                trees++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.LivelyhoodVegetables:
                                            if (!String.IsNullOrWhiteSpace(lVeg.Type))
                                            {
                                                lVegs.Add(lVeg);
                                                vegetablesCount++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SkillsTraining:
                                            if (!String.IsNullOrWhiteSpace(sTraining.Full_Name))
                                            {
                                                sTrainings.Add(sTraining);
                                                skillsTrainingCount++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialNetworkActivity:
                                            if (!String.IsNullOrWhiteSpace(snActivity.Social_Activities))
                                            {
                                                snActivities.Add(snActivity);
                                                socialActivityCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialNetworkNeighbours:
                                            if (!String.IsNullOrWhiteSpace(snNeighbour.ask_for_help))
                                            {
                                                snNeighbours.Add(snNeighbour);
                                                socialNeighbours++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialServices:
                                            if (!String.IsNullOrWhiteSpace(sService.Social_Services_Amenities))
                                            {
                                                sServices.Add(sService);
                                                socialServicesCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.HealthClinics:
                                            if (!String.IsNullOrWhiteSpace(hClinic.Clinic))
                                            {
                                                hClinics.Add(hClinic);
                                                clinicCounter++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                        case ModeTypes.SocialOrganisation:
                                            if (sOrganisation.Dingleton || sOrganisation.Siyathemba)
                                            {
                                                sOrganisations.Add(sOrganisation);
                                                socialOrganisations++;
                                            }
                                            modeSaved = true;
                                            mode = ModeTypes.None;
                                            break;
                                    }

                                }
                                #endregion
                            }


                            #region INSERT STATEMENTS
                            //insert into MainTable
                            string insertToMainTable = "" +
                                "INSERT INTO [Main Table] VALUES(" + mt.HouseholdID + ", " +
                               "'" + SQLClean(mt.InterviewerName) + "', " +
                                "'" + SQLClean(mt.HouseholdAddress) + "', " +
                                "'" + SQLClean(mt.StandNumber) + "', " +
                                "'" + CleanDate(mt.InterviewDate) + "', " +
                                "'" + SQLClean(mt.GPSCoord) + "', " +
                                "'" + boolToNum(mt.signature) + "', " +
                                "'" + boolToNum(mt.photoRespondent) + "', " +
                                "'" + boolToNum(mt.photoOfStand) + "', " +
                                "'" + boolToNum(mt.photosOfOutbuildings) + "', " +
                                "'" + boolToNum(mt.checkedBySupervisor) + "', " +
                                "'" + SQLClean(mt.intervieweeFullName) + "', " +
                                "'" + boolToNum(mt.ownHouse) + "', " +
                                "'" + SQLClean(mt.ownerName) + "', " +
                                "'" + SQLClean(mt.ownerID) + "', " +
                                "'" + SQLClean(mt.ownerTel) + "', " +
                                " " + (mt.noHHMembersonProp) + ", " +
                                "'" + boolToNum(mt.hhMembersemployedTshipi) + "', " +
                                "'" + boolToNum(mt.hhMembersOwnBusiness) + "', " +
                                "'" + boolToNum(mt.zimeleHubServices) + "', " +
                                "'" + boolToNum(mt.businesDevCentreServices) + "', " +
                                "'" + boolToNum(mt.businessPlanSubmitted) + "', " +
                                "'" + boolToNum(mt.businessLoanGranted) + "', " +
                                "'" + boolToNum(mt.fruitTrees) + "', " +
                                "'" + boolToNum(mt.petsOrLivestock) + "', " +
                                "'" + boolToNum(mt.liveStockOnGrazingLand) + "', " +
                                "'" + boolToNum(mt.sameNeighbours) + "', " +
                                "'" + SQLClean(mt.AccurateStatement) + "', " +
                                "'" + SQLClean(mt.saferInWhichSettlement) + "', " +
                                "'" + boolToNum(mt.crimeVictim) + "', " +
                                "'" + SQLClean(mt.drugAbuseStatements) + "', " +
                                "'" + SQLClean(mt.drugAbuseIncreaseReasons) + "', " +
                                "'" + boolToNum(mt.usedTheClinic) + "', " +
                                "'" + SQLClean(mt.clinicStatement) + "', " +
                                "'" + boolToNum(mt.hhBirths) + "', " +
                                "'" + boolToNum(mt.hhDeaths) + "', " +
                                "'" + boolToNum(mt.incomeChanged) + "', " +
                                "'" + SQLClean(mt.howIncomeChanged) + "', " +
                                "'" + boolToNum(mt.reduceReplacementProperty) + "', " +
                                "'" + boolToNum(mt.propertyChanges) + "', " +
                                "'" + SQLClean(mt.satisfactionLevel) + "', " +
                                "'" + SQLClean(mt.hhBetterOffInSiyathemba) + "', " +
                                "'" + SQLClean(mt.hhWorseOffInSiyathemba) + "', " +
                                "'" + boolToNum(mt.DingletonHH) + "', " +
                                "'" + SQLClean(mt.Survey_Name) + "') ";
                            cmd.CommandText = insertToMainTable;
                            int rMT = cmd.ExecuteNonQuery();
                            Console.WriteLine("1.   >>>>>>>>>ADDED MAIN TABLE DATA");

                            foreach (Business cB in businesses)
                            {
                                string insertStatement = "INSERT INTO [Business] VALUES(" + cB.Business_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cB.Business_Name) + "', " +
                              "'" + SQLClean(cB.Type_of_Business) + "', " +
                              "'" + boolToNum(cB.Submitted_to_offices) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("2.   >>>>>>>>>ADDED Business Data");
                            }

                            foreach (Crime cC in crimes)
                            {
                                string insertStatement = "INSERT INTO [Crime] VALUES(" + cC.Crime_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cC.CrimeString) + "', " +
                              "'" + SQLClean(cC.Other_specify) + "', " +
                              "'" + boolToNum(cC.Incident_reported) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("3.   >>>>>>>>>ADDED Crime Data");
                            }
                            foreach (Education cE in educations)
                            {
                                string insertStatement = "INSERT INTO [Education] VALUES(" + cE.Education_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cE.Full_Name) + "', " +
                              "'" + SQLClean(cE.School_Name) + "', " +
                              "'" + SQLClean(cE.Location) + "', " +
                              "'" + SQLClean(cE.Grade) + "', " +
                              "'" + SQLClean(cE.Mode_of_Transport) + "', " +
                              "'" + SQLClean(cE.Other_Transport) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("4.   >>>>>>>>>ADDED Education Data");
                            }

                            foreach (Employment cEmp in employments)
                            {
                                string insertStatement = "INSERT INTO [Employment] VALUES(" + cEmp.Employment_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "" + (cEmp.Household_Member_ID) + ", " +
                              "'" + SQLClean(cEmp.Full_Name) + "', " +
                              "'" + SQLClean(cEmp.Occupation) + "', " +
                              "'" + SQLClean(cEmp.Employer) + "', " +
                              "'" + SQLClean(cEmp.Location) + "', " +
                              "'" + SQLClean(cEmp.Transport) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("5.   >>>>>>>>>ADDED Employment Data");
                            }

                            foreach (Household_Business cHHB in houseHoldBusinesses)
                            {
                                string insertStatement = "INSERT INTO [Household Business] VALUES(" + cHHB.Business_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cHHB.Business_Type) + "', " +
                              "'" + SQLClean(cHHB.Specify_Other_Business) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("6.   >>>>>>>>>ADDED HouseHoldBusiness Data");
                            }

                            foreach (Household_Items cHHI in houseHoldItems)
                            {
                                string insertStatement = "INSERT INTO [Household Items] VALUES(" + cHHI.HH_Items_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cHHI.Household_Item) + "', " +
                              "'" + SQLClean(cHHI.Specify_Other_Item) + "', " +
                              "" + (cHHI.Number_of_Items) + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("7.   >>>>>>>>>ADDED HOUSEHOLDITEMS Data");
                            }

                            foreach (Household_Members cHHM in houseHoldMembers)
                            {
                                string insertStatement = "INSERT INTO [Household Members] VALUES(" + cHHM.HH_Members_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cHHM.Full_Name) + "', " +
                              "'" + SQLClean(cHHM.Relation_to_HH) + "', " +
                              "'" + SQLClean(cHHM.Sex) + "', " +
                              "" + (cHHM.age) + ", " +
                              "'" + SQLClean(cHHM.Residence_Status) + "', " +
                              "'" + SQLClean(cHHM.Residence_Other_Specify) + "', " +
                              "'" + SQLClean(cHHM.Education_Status) + "', " +
                              "'" + SQLClean(cHHM.Occupation) + "', " +
                              "'" + SQLClean(cHHM.Disability) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("8.   >>>>>>>>>ADDED HouseHoldMembers Data");
                            }

                            foreach (Expenses cE in expenses)
                            {
                                string insertStatement = "INSERT INTO [Expenses] VALUES(" + cE.Expenses_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cE.Expenditure_Sources) + "', " +
                              "'" + SQLClean(cE.Specify_Other_Expense) + "', " +
                              "" + (cE.Expense_Value) + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("9.   >>>>>>>>>ADDED Expense Data");
                            }
                            
                            string housingInsertStatement = "INSERT INTO [Housing] VALUES(" + housingCounter + ", " +
                                "" + mt.HouseholdID + ", " +
                                "'" + boolToNum(housing.Rent_Rooms) + "', " +
                                "" + (housing.If_Yes_how_many_tenants) + ", " +
                                "" + (housing.Rental_earned_on_a_monthly_basis) + ", " +
                                "'" + boolToNum(housing.Own_alternative_residence) + "', " +
                                "'" + SQLClean(housing.Location_of_alternative_residence) + "')";
                            cmd.CommandText = housingInsertStatement;
                            int resHousing = cmd.ExecuteNonQuery();
                            Console.WriteLine("10.   >>>>>>>>>ADDED Housing Data");

                            foreach (Income cI in incomes)
                            {
                                string insertStatement = "INSERT INTO [Income] VALUES(" + cI.Income_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(cI.Income_Sources) + "', " +
                              "'" + SQLClean(cI.Specify_Other_Income) + "', " +
                              "" + (cI.Income_Value) + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("11.   >>>>>>>>>ADDED Expense Data");
                            }

                            string insertStatementRes = "INSERT INTO [Resettlement Experience] VALUES(" + reCounter + ", " +
                             "" + mt.HouseholdID + ", " +
                             "'" + SQLClean(ressettlment.Stressful_experience) + "', " +
                             "'" + SQLClean(ressettlment.Enjoyable_experience) + "', " +
                             "'" + SQLClean(ressettlment.Better_living_conditions) + "', " +
                             "'" + SQLClean(ressettlment.Improved_service_access) + "', " +
                             "'" + SQLClean(ressettlment.Sense_of_community) + "', " +
                             "'" + SQLClean(ressettlment.Move_back_to_Dingleton) + "', " +
                             "'" + SQLClean(ressettlment.Sense_of_belonging) + "', " +
                             "'" + SQLClean(ressettlment.Life_changed_for_better) + "', " +
                             "'" + SQLClean(ressettlment.Garden_too_small) + "', " +
                             "'" + SQLClean(ressettlment.Higher_cost_of_living) + "', " +
                             "'" + SQLClean(ressettlment.Noisier) + "', " +
                             "'" + SQLClean(ressettlment.More_vulnerable_to_crime) + "', " +
                             "'" + SQLClean(ressettlment.Higher_drug_alcohol_abuse) + "', " +
                             "'" + SQLClean(ressettlment.Happy_with_quality_of_house) + "', " +
                             "'" + SQLClean(ressettlment.Happy_I_relocated) + "')";
                            cmd.CommandText = insertStatementRes;
                            int resNum = cmd.ExecuteNonQuery();
                            Console.WriteLine("12.   >>>>>>>>>ADDED RESETTLEMENT Data");

                            foreach (Health_Conditions healthC in hConditions)
                            {
                                string insertStatement = "INSERT INTO [Health_Conditions] VALUES(" + healthC.Health_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(healthC.Medical_Condition) + "', " +
                              "" + (healthC.No_HH_members_diagnosed) + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("13.   >>>>>>>>>ADDED Health Condition Data");
                            }
                            /*
                            string insertStatementHSF = "INSERT INTO [Household Structures_Fittings] VALUES(" + hFittingsCounter + ", " +
                             "" + mt.HouseholdID + ", " +
                             "'" + boolToNum(hFittings.Solar_geyser) + "', " +
                             "'" + boolToNum(hFittings.Plumbing) + "', " +
                             "'" + boolToNum(hFittings.Kitchen_taps) + "', " +
                             "'" + boolToNum(hFittings.Bathroom_taps) + "', " +
                             "'" + boolToNum(hFittings.Electrical_stove) + "', " +
                             "'" + boolToNum(hFittings.Electrical_wiring) + "', " +
                             "'" + boolToNum(hFittings.Electricity_meter) + "', " +
                             "'" + boolToNum(hFittings.Floor_tiles) + "', " +
                             "'" + boolToNum(hFittings.Doors) + "', " +
                             "'" + boolToNum(hFittings.Security_gates) + "', " +
                             "'" + boolToNum(hFittings.JoJo_tank) + "', " +
                             "'" + boolToNum(hFittings.Boundary_fence) + "')";
                            cmd.CommandText = insertStatementHSF;
                            int hFNum = cmd.ExecuteNonQuery();
                            Console.WriteLine("14.   >>>>>>>>>ADDED Householding Structures Fittings Data");
                            */
                            foreach (Housing_Lease hL in hLeases)
                            {
                                string insertStatement = "INSERT INTO [Housing_Lease] VALUES(" + hL.Lease_ID + ", " +
                              "" + hL.Housing_ID + ", " +
                              "'" + SQLClean(hL.Full_Name) + "', " +
                              "'" + boolToNum(hL.Formal_Rental_Agreement) + "', " +
                              "" + (hL.Amount) + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("15.   >>>>>>>>>ADDED Leases Data");
                            }

                            foreach (Livelihood_Grazing LG in lGrazings)
                            {
                                string insertStatement = "INSERT INTO [Livelihood_Grazing] VALUES(" + LG.Grazing_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Type) + "', " +
                              "" + LG.Number + ", " +
                              "'" + SQLClean(LG.Specify_Other) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("16.   >>>>>>>>>ADDED Livelihood_Grazing Data");
                            }

                            foreach (Livelihood_Livestock LG in lLivestocks)
                            {
                                string insertStatement = "INSERT INTO [Livelihood_Livestock] VALUES(" + LG.Livestock_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Type) + "', " +
                              "" + LG.Number + ", " +
                              "'" + SQLClean(LG.Specify_Other) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("17.   >>>>>>>>>ADDED Livelihood_Livestock Data");
                            }

                            foreach (Livelihood_Trees LG in lTrees)
                            {
                                string insertStatement = "INSERT INTO [Livelihood_Trees] VALUES(" + LG.Trees_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Type) + "', " +
                              "" + LG.Number + ", " +
                               "" + LG.Productive_Trees + ", " +
                              "'" + SQLClean(LG.Use) + "', " +
                               "'" + SQLClean(LG.Specify_Other) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("18.   >>>>>>>>>ADDED Livelihood_Trees Data");
                            }

                            foreach (Livelihood_Vegetables LG in lVegs)
                            {
                                string insertStatement = "INSERT INTO [Livelihood_Vegetables] VALUES(" + LG.Vegetable_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Type) + "', " +
                              "'" + boolToNum(LG.Dingleton) + "', " +
                                "'" + boolToNum(LG.Siyathemba) + "', " +
                               "'" + SQLClean(LG.Specify_Other) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("19.   >>>>>>>>>ADDED Livelihood_Vegetables Data");
                            }

                            foreach (Skills_Training LG in sTrainings)
                            {
                                string insertStatement = "INSERT INTO [Skills_Training] VALUES(" + LG.Skills_Training_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Full_Name) + "', " +
                              "'" + SQLClean(LG.Training_Programme) + "', " +
                                "'" + CleanDate(LG.Start_Date) + "', " +
                                "'" + CleanDate(LG.End_Date) + "', " +
                               "'" + boolToNum(LG.Certification) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("20.   >>>>>>>>>ADDED Skills_Training Data");
                            }

                            foreach (Social_Networks_Activities LG in snActivities)
                            {
                                string insertStatement = "INSERT INTO [Social Networks_Activities] VALUES(" + LG.Activities_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Social_Activities) + "', " +
                              "'" + SQLClean(LG.Social_Activities_Other) + "', " +
                                "'" + boolToNum(LG.Dingleton) + "', " +
                                "'" + boolToNum(LG.Siyathemba) + "', " +
                               "'" + SQLClean(LG.Reason_for_change) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("21.   >>>>>>>>>ADDED Social_Networks_Activities Data");
                            }

                            foreach (Social_Networks_Neighbours LG in snNeighbours)
                            {
                                string insertStatement = "INSERT INTO [Social Networks_Neighbours] VALUES(" + LG.Neighbours_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.ask_for_help) + "', " +
                                "'" + boolToNum(LG.Dingleton) + "', " +
                                "'" + boolToNum(LG.Siyathemba) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("22.   >>>>>>>>>ADDED Social_Networks_Neighbours Data");
                            }

                            foreach (Social_Services LG in sServices)
                            {
                                string insertStatement = "INSERT INTO [Social_Services] VALUES(" + LG.Social_Services_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Social_Services_Amenities) + "', " +
                               "'" + SQLClean(LG.Dingleton_Transport) + "', " +
                                "'" + SQLClean(LG.Dingleton_Transport_Other) + "', " +
                                 "" + LG.Dingleton_Time + ", " +
                                  "" + LG.Dingleton_Cost + ", " +
                                "'" + SQLClean(LG.Siyathemba_Transport) + "', " +
                                "'" + SQLClean(LG.Siyathemba_Transport_Other) + "', " +
                                 "" + LG.Siyathemba_Time + ", " +
                                  "" + LG.Siyathemba_Cost + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("23.   >>>>>>>>>ADDED Social_Services Data");
                            }

                            foreach (Health_Clinics LG in hClinics)
                            {
                                string insertStatement = "INSERT INTO [Health_Clinics] VALUES(" + LG.Clinic_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Clinic) + "', " +
                               "'" + SQLClean(LG.Frequency_of_Visits) + "', " +
                                "'" + SQLClean(LG.Mode_of_Transport) + "', " +
                                 "'" + SQLClean(LG.Other_Transport) + "', " +
                                  "" + LG.Distance + ")";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("24.   >>>>>>>>>ADDED Health_Clinics Data");
                            }

                            foreach (Social_Organisations LG in sOrganisations)
                            {
                                string insertStatement = "INSERT INTO [Social_Organisations] VALUES(" + LG.Organisation_ID + ", " +
                              "" + mt.HouseholdID + ", " +
                              "'" + SQLClean(LG.Organisation) + "', " +
                              "'', " +
                                "'" + boolToNum(LG.Dingleton) + "', " +
                                "'" + boolToNum(LG.Siyathemba) + "')";
                                cmd.CommandText = insertStatement;
                                int res = cmd.ExecuteNonQuery();
                                Console.WriteLine("25.   >>>>>>>>>ADDED Social_Organisations Data");
                            }
                            #endregion

                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error Processing data " + e.Message);
                Console.WriteLine("Stacktrace: " + e.StackTrace);
            }

        }

        public string SQLClean(string s)
        {

            if (!String.IsNullOrWhiteSpace(s))
            {
                s.Trim();
                if (s.Length > 255)
                {
                    s = s.Substring(0, 255);
                }
                return s.Replace("'", "''");

            }
            else
            {
                return "";
            }

        }

        public string CleanDate(DateTime d)
        {
            return d.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public int GetValidInt(string s)
        {
            int x = 0;
            if (!String.IsNullOrWhiteSpace(s))
            {
                Int32.TryParse(s, out x);
            }
            return x;

        }

        public double GetValidDouble(string s)
        {
            double x = 0;
            if (!String.IsNullOrWhiteSpace(s))
            {
                Double.TryParse(s, NumberStyles.Any, CultureInfo.InstalledUICulture, out x);
            }
            return x;

        }
        public string boolToNum(bool b)
        {
            return b ? "1" : "0";
        }
        
    }
}
