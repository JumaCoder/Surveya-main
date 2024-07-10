using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SurveyaMapping
{
    public class MainTable
    {
        public int HouseholdID;
        public string InterviewerName;
        public string HouseholdAddress;
        public string StandNumber;
        public DateTime InterviewDate;
        public string GPSCoord;
        public bool signature;
        public bool photoRespondent;
        public bool photoOfStand;
        public bool photosOfOutbuildings;
        public bool checkedBySupervisor;
        public string intervieweeFullName;
        public bool ownHouse;
        public string ownerName;
        public string ownerID;
        public string ownerTel;
        public int noHHMembersonProp;
        public bool hhMembersemployedTshipi;
        public bool hhMembersOwnBusiness;
        public bool zimeleHubServices;
        public bool businesDevCentreServices;
        public bool businessPlanSubmitted;
        public bool businessLoanGranted;
        public bool fruitTrees;
        public bool petsOrLivestock;
        public bool liveStockOnGrazingLand;
        public bool sameNeighbours;
        public string AccurateStatement;
        public string saferInWhichSettlement;
        public bool crimeVictim;
        public string drugAbuseStatements;
        public string drugAbuseIncreaseReasons;
        public bool usedTheClinic;
        public string clinicStatement;
        public bool hhBirths;
        public bool hhDeaths;
        public bool incomeChanged;
        public string howIncomeChanged;
        public bool reduceReplacementProperty;
        public bool propertyChanges;
        public string satisfactionLevel;
        public string hhBetterOffInSiyathemba;
        public string hhWorseOffInSiyathemba;
        public bool DingletonHH;
        public string Survey_Name;

        public MainTable()
        {

        }
    }

    public class Business
    {
        public int Business_ID;
        public int Household_ID;
        public string Business_Name;
        public string Type_of_Business;
        public bool Submitted_to_offices;
    }
    public class Crime
    {
        public int Crime_ID;
        public int Household_ID;
        public string CrimeString;
        public string Other_specify;
        public bool Incident_reported;
    }

    public class Education
    {
        public int Education_ID;
        public int Household_ID;
        public string Full_Name;
        public string School_Name;
        public string Location;
        public string Grade;
        public string Mode_of_Transport;
        public string Other_Transport;

        public Education()
        {

        }
    }

    public class Employment
    {
        public int Employment_ID;
        public int Household_ID;
        public int Household_Member_ID;
        public string Full_Name;
        public string Occupation;
        public string Employer;
        public string Location;
        public string Transport;

        public Employment()
        {
        }
    }

    public class Household_Business
    {
        public int Business_ID;
        public int Household_ID;
        public string Business_Type;
        public string Specify_Other_Business;

        public Household_Business()
        {
        }
    }

    public class Household_Items
    {
        public int HH_Items_ID;
        public int Household_ID;
        public string Household_Item;
        public string Specify_Other_Item;
        public int Number_of_Items;

        public Household_Items()
        {
        }
    }

    public class Household_Members
    {
        public int HH_Members_ID;
        public int Household_ID;
        public string Full_Name;
        public string Relation_to_HH;
        public string Sex;
        public int age;
        public string Residence_Status;
        public string Residence_Other_Specify;
        public string Education_Status;
        public string Occupation;
        public string Disability;

        public Household_Members()
        {
        }
    }

    public class Expenses
    {
        public int Expenses_ID;
        public int Household_ID;
        public string Expenditure_Sources;
        public string Specify_Other_Expense;
        public double Expense_Value;

        public Expenses()
        {
        }
    }

    public class Housing
    {
        public int Housing_ID;
        public int Household_ID;
        public bool Rent_Rooms;                                                             //"08EFABA7-2031-4E78-8E20-CFF0A561EF2E"
        public int If_Yes_how_many_tenants;                                         //"2F68AEFE-E3CC-42D2-BAF0-47A56C3EAB04"
        public double Rental_earned_on_a_monthly_basis;                  //"736BBB8B-73F9-4019-BA61-0F896DF1175F"
        public bool Own_alternative_residence;                                      //"8B396A7C-F92D-493F-B34F-0F7B873FECA9"
        public string Location_of_alternative_residence;                        //"59BDFAB7-0810-4AC5-AAAC-8701D7242510"

        public Housing()
        {
        }
    }

    public class Income
    {
        public int Income_ID;
        public int Household_ID;
        public string Income_Sources;
        public string Specify_Other_Income;
        public double Income_Value;

        public Income()
        {
        }
    }

    public class Resettlement_Experience
    {
        public int Resettlement_ID;
        public int Household_ID;
        public string Stressful_experience;
        public string Enjoyable_experience;
        public string Better_living_conditions;
        public string Improved_service_access;
        public string Sense_of_community;
        public string Move_back_to_Dingleton;
        public string Sense_of_belonging;
        public string Life_changed_for_better;
        public string Garden_too_small;
        public string Higher_cost_of_living;
        public string Noisier;
        public string More_vulnerable_to_crime;
        public string Higher_drug_alcohol_abuse;
        public string Happy_with_quality_of_house;
        public string Happy_I_relocated;

        public Resettlement_Experience()
        {
        }
    }

    public class Health_Clinics      //GroupName="Clinic Visits"
    {
        public int Clinic_ID;
        public int Household_ID;
        public string Clinic;                            //RowName
        public string Frequency_of_Visits;  //3D10A2B2-1B96-4B7B-8D7E-AC0E2F2D1248
        public string Mode_of_Transport;  //912D4563-1609-4AE4-BA3C-535052E17741
        public string Other_Transport;       // {NOTHING}
        public int Distance;                         // 28B5C594-1CD2-4CE9-A0A5-A64790702585   but it says `Travel time (minutes)`

        public Health_Clinics()
        {
        }
    }
    public class Health_Conditions    // GROUP: "Medication Conditions"
    {
        // IF ResponseValueQuestionID = "4FEFC9AC-82B1-4A3E-B0DD-BE3C56C3D052" && ResponseValue == "Yes"
        public int Health_ID;
        public int Household_ID;
        public string Medical_Condition; //"4FEFC9AC-82B1-4A3E-B0DD-BE3C56C3D052" ->  RowName
        public int No_HH_members_diagnosed; //"D355229B-4EF2-4448-92C3-3D0DC9F124B1" -> ResponseValue
        // Above two must have the same QuestionRowID

        public Health_Conditions()
        {
        }
    }

    public class Householding_Structures_Fittings    //GroupName="Fixtures"  ResponseValueQuestionID="7D3D7A1A-565E-4A80-BEEF-11FCB89A6095"
    {
        public int Fitting_ID;
        public int Household_ID;
        public bool Solar_geyser;             // A45BAA36-F348-4FC5-BB4E-04DD6B0493BE  <- QuestionRowID
        public bool Plumbing;                  // FAC6FDA9-3EEF-4775-9CBA-D0CCB7AFA287  <- QuestionRowID
        public bool Kitchen_taps;            // 42D432E7-5962-4261-89A8-64433D00C995  <- QuestionRowID
        public bool Bathroom_taps;        // 1AB339EC-D9AE-4B7A-B3FC-128A5A2CDB98  <- QuestionRowID
        public bool Electrical_stove;       // 042E9607-2B5C-41F3-B343-49C1940FDE2E  <- QuestionRowID
        public bool Electrical_wiring;      // E4AE075A-B8BA-4537-B6BE-ED5695A0B53D  <- QuestionRowID
        public bool Electricity_meter;     // 7D73E93F-399C-4298-8231-9803651FA3A1  <- QuestionRowID
        public bool Floor_tiles;                // B3C4EB71-7098-4E6F-83CA-B0649C9FB9BE  <- QuestionRowID
        public bool Doors;                       // 8FB41CB1-0A5F-405F-A813-528AE1893F03  <- QuestionRowID
        public bool Security_gates;        // CC10A277-C1F7-47A3-BB07-7178767B800F  <- QuestionRowID
        public bool JoJo_tank;                // 612EA8B4-3285-4229-9058-EB8F884BDAF4  <- QuestionRowID
        public bool Boundary_fence;     // D3B1A17F-7FD3-4E52-883A-4B09CDCB1178  <- QuestionRowID

        public Householding_Structures_Fittings()
        {
        }
    }

    public class Housing_Lease    //GroupName="Tenants: Tenant Details"   SAME QuestionRowID
    {
        public int Lease_ID;
        public int Housing_ID;
        public String Full_Name;                                           // 2724D630-71C1-473F-BDC9-9A55CD3B34AE
        public bool Formal_Rental_Agreement;                  // F8E1D61F-CAFB-4A6C-8F3D-3106D77A4BBD
        public double Amount;                                           // 1590986C-2BEE-484D-A3C2-F73845FBB4F0

        public Housing_Lease()
        {
        }
    }

    public class Livelihood_Grazing    //Page="Livestock" GroupName="Details"   ResponseValueQuestionID="673F6FEA-438E-42AA-B2B2-EF97F2641A48"
    {
        public int Grazing_ID;
        public int Household_ID;
        public String Type;                                           // RowName
        public string Specify_Other;                  // {NOTHING}
        public int Number;                                           // ResponseValue [IF HAS VALUE THEN ADD Livestock]
        public Livelihood_Grazing()
        {
        }
    }
    public class Livelihood_Livestock    //Page="Livestock" GroupName="Details"   ResponseValueQuestionID="C35D6827-5464-4BC1-B5C9-38EBF79A1CAD"
    {
        public int Livestock_ID;
        public int Household_ID;
        public String Type;                                           // RowName
        public string Specify_Other;                  // {NOTHING}
        public int Number;                                           // ResponseValue [IF HAS VALUE THEN ADD Livestock]
        public Livelihood_Livestock()
        {
        }
    }

    public class Livelihood_Trees    //Page="Fruit Trees" GroupName="Information on productive trees"   ResponseValueQuestionID="BD84ED01-DCC4-49A3-A2B8-773CDE24A90A"
    {
        public int Trees_ID;
        public int Household_ID;
        public String Type;                                           // RowName
        public int Number;                                           // ResponseValue [IF HAS VALUE THEN ADD Livestock]
        public int Productive_Trees;                   // {NOTHING}
        public string Use;                                    // {NOTHING}
        public string Specify_Other;                  // {NOTHING}

        public Livelihood_Trees()
        {
        }
    }

    public class Livelihood_Vegetables    //Page="Vegetable Gardens" GroupName="Cultivation"   ResponseValueQuestionID="BD84ED01-DCC4-49A3-A2B8-773CDE24A90A"
    {
        public int Vegetable_ID;
        public int Household_ID;
        public String Type;                                           // RowName
        public bool Dingleton;                                    // 96A395D2-C883-4483-9D44-3AABFFCC2759
        public bool Siyathemba;                                 // 64FCB55F-5FCF-482D-B005-52408AE35B09
        public string Specify_Other;                  // IF RowName=="Other (specify)" and ResponseValue!=null

        public Livelihood_Vegetables()
        {
        }
    }

    public class Skills_Training    //Page="Skills and Training" GroupName="Skills and Training: Household Members"  SAME QuestionRowID
    {
        public int Skills_Training_ID;
        public int Household_ID;
        public String Full_Name;                                           // C573A306-5A08-4643-8CBC-6273A45D86F9
        public String Training_Programme;                                           // 27A38A45-A435-4E2E-8F96-2ECFD04CD9A7
        public DateTime Start_Date;                                           // 7CA0AA47-D81B-444E-A285-BBD044A97442
        public DateTime End_Date;                                    // 4C7198AD-241F-4666-8426-38624A9F3947
        public bool Certification;                                  // F504FCC1-906B-48E9-A78F-2800CCD7B161

        public Skills_Training()
        {
        }
    }
    public class Social_Networks_Activities    //Page="Social Activites" GroupName="Community Involvement"  SAME QuestionRowID
    {
        public int Activities_ID;
        public int Household_ID;
        public String Social_Activities;                                           // RowName
        public String Social_Activities_Other;                                           // IF RowName=="Other (specify)"
        public bool Dingleton;                                           // 94E19693-FF17-4AAA-BBE7-249CB90367EB
        public bool Siyathemba;                                           // 714C8152-51DA-41B2-A273-CF6841BB55C8
        public String Reason_for_change;                                  // 7C44BC08-1130-48E8-80BC-B1E4E135F4C0

        public Social_Networks_Activities()
        {
        }
    }

    public class Social_Networks_Neighbours    //Page="Social Networks" GroupName="Community Support"  SAME QuestionRowID
    {
        public int Neighbours_ID;
        public int Household_ID;
        public String ask_for_help;                                           //RowName
        public bool Dingleton;                                           // 24146343-4527-4329-9C8B-FFCD9C0DE37D
        public bool Siyathemba;                                           // 28EC571A-4BD8-4493-B4CA-AEC79D842CF8

        public Social_Networks_Neighbours()
        {
        }
    }
    public class Social_Organisations //Page="Social Services" GroupName="Assistance Received"
    {
        public int Organisation_ID;
        public int Household_ID;
        public String Organisation;                                           //  RowName
        public String Specify_Other;                                           //  
        public bool Dingleton;                                           // B8294638-ED7D-485D-AA01-936CBFF8753D
        public bool Siyathemba;                                           // FFB96448-E2F9-4EB9-BECF-48133D31E747

        public Social_Organisations()
        {
        }
    }

    public class Social_Services     //GroupName="Dingleton vs Siyathemba" SAME QuestionRowID
    {
        public int Social_Services_ID;
        public int Household_ID;
        public String Social_Services_Amenities;        //  RowName
        public String Dingleton_Transport;              //  7E9F179B-3FF2-4522-ADDE-1697FA3A6B46
        public String Dingleton_Transport_Other;        //  {NOTHING}
        public int Dingleton_Time;                     //  D73C4FDC-1B5B-4DA7-A3A4-55A21B0F930E
        public double Dingleton_Cost;              //  F42ADFA7-B7E0-443F-9ACF-E56DD4CA7341

        public String Siyathemba_Transport;              //  BAB85386-7849-4BB5-9058-FF52F5D2F292
        public String Siyathemba_Transport_Other;        // {NONE}
        public int Siyathemba_Time;                     // 37DF8C42-4326-4B7D-A033-2C481A8A6882
        public double Siyathemba_Cost;              //  42AD8276-8CA3-40AE-B705-69145EF660C7

        public Social_Services()
        {
        }
    }
}
