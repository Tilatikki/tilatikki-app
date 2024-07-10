*** Settings ***
Library          SeleniumLibrary
Library          Telnet
Library          String
Library          BuiltIn
Library          RequestsLibrary
Library          Collections
Library          OperatingSystem
Resource         keywords.robot
Resource         variables.robot
Suite Setup      Open Browserwindow
Suite Teardown   Close Browser

*** Test Cases ***
# OK
Register new user
    [Tags]  register  valid
    Go To Registerationpage
    Enter Registeration Credentials      ${firstname}  ${lastname}  ${email}  ${pw}
	Click Register Button
    Wait Until Location Is Not           ${url}/register    2
    Location Should Be                   ${url}/login

# OK
Register existing user
    [Tags]  register  invalid
    Go To Registerationpage
    Enter Registeration Credentials  ${firstname}  ${lastname}  ${email}  ${pw}
	Create Session                   MySession    http://localhost:5050/
	&{user}=                         Create Dictionary  name=${firstname}  surname=${lastname}  email=${email}  password=${pw}
    POST On Session                  MySession  /register  json=${user}  expected_status=any
	Status Should Be                 400
    Location Should Be               ${url}/register

# OK
Register with missing fields
    [Tags]  register  invalid
    Go To Registerationpage
    Enter Registeration Credentials  ${firstname}  ${lastname}  ${EMPTY}  ${pw}
	Create Session                   MySession    http://localhost:5050/
	&{user}=                         Create Dictionary  name=${firstname}  surname=${EMPTY}  email=${EMPTY}  password=${EMPTY}
    POST On Session                  MySession  /register  json=${user}  expected_status=any
	Status Should Be                 500
    Location Should Be               ${url}/register

# OK
Register new randomized user
    [Tags]  register  valid
    Go To Registerationpage
	${user}=                         Create Random User
	Enter Registeration Credentials  ${user['firstname']}  ${user['lastname']}  ${user['email']}  ${pw}
	Click Register Button
	Wait Until Location Is Not       ${url}/register    2
	Location Should Be               ${url}/login

# OK
Login nonexistent user
    [Tags]  login  invalid
    Go To Loginpage
	${user}=                   Create Random User
	Enter Login Credentials    ${user['email']}  ${pw}
	Create Session             MySession    http://localhost:5050/
	&{user}=                   Create Dictionary  email=${user['email']}  password=${pw}
    POST On Session            MySession  /login  json=${user}  expected_status=any
	Status Should Be           404
    Location Should Be         ${url}/login

# OK
Login wrong password
    [tags]  login  invalid
    Go To Loginpage
	Enter Login Credentials  ${email}  ${pw}123123
	Create Session           MySession    http://localhost:5050/
	&{user}=                 Create Dictionary  email=${email}  password=${pw}123123
    POST On Session          MySession  /login  json=${user}  expected_status=any
	Status Should Be         401
    Location Should Be       ${url}/login

# OK
Login existing user
    [Tags]  login  valid
	Login User Detailed    ${email}  ${pw}  ${firstname}  ${lastname}

# OK
Select school
    [Tags]  navigate  valid
	Go To Reservationpage

# OK
Navigate back from pages
    [Tags]  logout  login  navigate  valid
	Logout User Detailed
	Login User Detailed      ${email}  ${pw}  ${firstname}  ${lastname}
	Go Back
	Location Should Be       ${url}/schools
	Go To Reservationpage
	Go Back
	Location Should Be       ${url}/schools
	Go To Settingspage
	Go Back
	Location Should Be       ${url}/schools

