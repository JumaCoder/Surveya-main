/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 04 July 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 04 July 2016
 Title   		: 04_schema_2016.07.1.1
 Purpose  		: Available Rights
 Instructions 	: Run after 03_schema_2016.06.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='04'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('59D2908F-A37C-4CB6-B3DE-64B410251750','Company','GetCompanyUsers','Get Company Users','Retrieve all the users for a specific company'),
('D2CC4B6E-7FA3-4AB1-9B48-0D4A45E6D3E0','User','AddUser','Add user','Manager: add a user to your company'),
('D3E85999-470F-4C2F-92CB-D8FD59834335','User','UpdateUser','Update User details','Update a users details'),
('047F2718-C9FA-4188-915E-4A0341E220FB','User','DeactivateUser','Deactivate user','deactivate any user in his company'),
('02D695F6-08D8-454C-86AB-9609811D47B4','User','ReactivateUser','Reactivate user','reactivate any user in his company'),
('54AD3EF2-F14E-4113-B207-6282AEE1DE3C','User','GetUserDetails','Get User Details','Get a specific users details'),
('44035E1C-03C4-4B30-BBFB-1D735636809D','Role','AddRole','Add Role and rights','Admin: Add a new role'),
('77A8B91F-9339-4C53-A73B-515CC9E6FEB1','Role','UpdateRole','Update role and rights','Admin: update the specified rights of a specified role (Add/Remove existing rights (id) (JArray) to an existing role)'),
('D5587397-1567-4642-8366-B2A2E0FF2EC2','Role','GetAllRightsForRole','Get all rights','Admin: can view a list of all the rights'),
('5EBEF77C-7C85-4F07-9C23-8DEC58FE5521','Role','UpdateUserRoleInCompany','Update user role in a company','Manager: update the role of a user within his own company'),
('1909CCEF-D65C-43AA-B586-41EC92C7A936','Role','UpdateUserRoleInProject','Update user role in a project','Manager: update the role of a user within a project in the company'),
('8D0F99C1-3C38-40F5-8AF2-598025B2AF92','Project','CreateProject','Create project','Manager: Create a project for his company'),
('FE6C3756-FB8E-4F2B-8F4C-F120013FA2B4','Project','AddTeamMember','Add team member','Manager: the manager can add a user to a project team'),
('9921FC31-0856-4B51-A3A9-B3F391C77708','Project','ImportTeam','Import team','Manager: import a team from another project'),
('D2A78997-F372-4CDF-8D0A-4C0F75D8EA70','Project','StartProject','Start project','Manager: Start a project within his own company'),
('81160051-01CD-4466-B2A3-E54B36DE8D40','Project','EndProject','End project','Manager: End a project within his own company'),
('B0318685-E44F-4E0D-8735-B7AC1797A0A4','Project','GetAllProjectsForCompany','View All Projects For Company','Manager: View all the projects for the company'),
('22E2E4FB-929E-4DA5-9F7C-2A92E9672438','Project','GetSpecificProject','View details of a specified project','Manager: View details of a specified project'),
('6378FF08-302B-4485-A0EA-6431B8937113','Survey','AddSurvey','Add Survey','Create a new Survey'),
('3EBA762B-D792-4600-B99F-9CE219F64377','Survey','GetAllSurveysForProject','Get All surveys for project','Manager: Get all the surveys for the project'),
('6CE39434-5803-48D5-82C6-AB1DD4608EF4','Survey','GetSpecificSurvey','Get Specific Survey Details','Manager: Get the details of the survey'),
('3FEA99FD-EAEF-4847-AD27-6F86FD14CDDC','Question','CreateQuestionGroup','Create Question Group','Create a group of questions'),
('15349415-6C70-4DF7-9397-59922D59016A','Question','RemoveQuestionGroup','Remove Question Group',''),
('044026C0-17E4-4C3A-8DCA-AFA10D53A97B','Question','RemoveQuestionGroupAndQuestions','Remove Question Group And Questions','remove the group and its questions at the same time'),
('AF65CBEA-EFA1-4ACC-96A9-10286E383FF5','Question','GetAllQuestionGroupsForSurvey','Get All Question Groups For Survey','get all the question groups that are assigned to the survey'),
('68D96BC0-51B1-4287-BB34-BEA53C2C4768','Role','DeactivateRole','Delete Role','delete a role in your company'),
('661F728C-18EB-45C2-BD0D-6AC0F39FAB89','Role','ReactivateRole','Reactivate Role','reactivate a deleted role in your company'),
('9DDDA044-AF80-4659-A79B-54EB64F905C8','Role','GetUsersInRole','Get Users In Role','Get the users in a specified role'),
('BF52E50F-16C1-42B9-ACEC-9F31EC0B4D1D','Role','ReassignUserToRole','Reassign User To Role','reassign the user to a new role'),
('52A9D56D-DB00-4C99-AD2F-13A1525B807D','Project','ResendTeamMemberInvite','Resend Team Member Invite','Reinvite a team member to the project'),
('5EDC4E9E-F581-492D-A79C-C4E2CF8279EB','Project','RequestProjectDocuments','Request Project Documents','Email all members that have missing documents'),
('162D7D5A-70A0-42B3-98DD-463C5EB137DA','User','ViewUserDocuments','View User Documents','view the users documents'),
('8A4F0945-CCA9-45C4-A14C-2DB547A21126','User','AddUserDocument','Add User Documents','add a new user document'),
('9AC40E5C-5055-4604-AA94-083446B03437','User','DeleteUserDocument','Delete User Documents','delete a user document'),
('6EAB8560-E5B0-462D-9898-02432C94255B','Question','CreateQuestion','Create Question','create a new question'),
('10DF1783-F94C-4372-A755-F7C5A076975B','Question','RemoveQuestion','Remove Question','remove a question'),
('9B53B634-0986-48D0-BCF9-39E715049FF7','Question','GetAllQuestionsForGroup','Get All Questions For Group','get a list of the questions assigned to a group'),
('DE690439-1D00-484F-961F-C6580BEB350B','ActivityStream','ViewActivityStream','Activity Stream','View and filter the Activity Stream'),
('6B8C5DD3-FC3F-47F3-93C3-15387BC24BE5','Question','UpdateQuestionGroup','Update Question Group','update a group of questions'),
('DECB4FB2-3599-4375-9547-5F4909CB2D8F','Question','UpdateQuestion','Update Question','update a question'),
('F729E67A-DAAE-4574-88F0-E39FB35F08C5','Question','MoveGroupAndQuestion','Move Group And Question','change the order of a question and group'),
('401D48BE-4C4A-44E4-97B6-A61ED33D9DAC','Project','UpdateProject','Update Project','update a projects details'),
('711152CF-3DE2-410C-A1A2-FF4060CD184D','Survey','UpdateSurvey','Update Survey','update a surveys details'),
('0C6557FD-FD43-4A79-974A-59DA16744974','Project','DeactivateProject','Deactivate Project','Deactivate a Project'),
('75182EDA-1367-4BCC-B5FD-3C4F29195739','Project','ReactivateProject','Reactivate Project','reactivate a project'),
('1E9BF6B6-C554-4D6F-BE82-178A7D314F2A','Survey','DeactivateSurvey','Deactivate Survey','Deactivate a Survey'),
('B4B97B76-3638-4A6A-9E08-C403FFED12E7','Survey','ReactivateSurvey','Reactivate Survey','ReactivateSurvey'),
('7D2EC6B6-7AAD-4E6F-9602-07170BD36F45','Project','GetTeamMembers','Get Team Members','View all team members'),
('327D7E3B-781A-4BC1-946F-1D9E2C3766BB','Survey','GetSurveysForUser','Get Surveys For User','A list of all the surveys for the user'),
('990ACE45-E9BF-472D-A60B-22B385EAE3E8','Project','RemoveTeamMember','Remove team members','Remove team members that are available for surveys for the specified project'),
('D0592470-AA3E-4C6B-8A68-94154567CDA1','Project','ActivateTeamMember','Activate Team Members','Deactivate / Reactivate team members on a project'),
('3187769E-7846-43A9-A46B-BF7D62458597','User','ResetPassword','Reset a Password','Reset a user within the companys password'),
('A87E283D-134F-4E4B-A413-F166BFAB40C9','Survey','AddTeamMemberToSurvey','Add survey user','Add a team member to a survey'),
('11C15AC6-CEA6-4336-9948-12C537A6557D','Survey','RemoveTeamMemberFromSurvey','Remove survey user','Remove a team member from a survey'),
('3905C995-E68B-443B-BAD6-D2123B2495F4','Survey','GetTeamMembersForSurvey','Get Survey Users','View a list of the users that are registered for the Survey')
		
	

/*
select newid();

('','','','',''),
*/
GO
